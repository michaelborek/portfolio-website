'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '../../utils/basePath';
import { FS, HOST, USER, type FsNode } from './data';
import MatrixRain from './MatrixRain';

type View = 'terminal' | 'doc';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const normalize = (path: string, cwd: string) => {
  if (!path) return cwd;
  const abs = path.startsWith('/')
    ? path
    : (cwd === '/' ? '' : cwd) + '/' + path;
  const parts = abs.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') {
      stack.pop();
      continue;
    }
    stack.push(p);
  }
  return '/' + stack.join('/');
};

const exists = (p: string) => FS[p] !== undefined;
const isDir = (p: string) => FS[p]?.type === 'dir';
const shortCwd = (cwd: string) => (cwd === '/' ? '~' : '~' + cwd);

/** Render a single "line:cls|text" entry as inline HTML. */
function renderLineEntryHtml(entry: string): string {
  const m = /^line:([a-z]*)\|([\s\S]*)$/.exec(entry);
  if (!m) return `<div class="line">${escapeHtml(entry)}</div>`;
  const cls = m[1];
  const text = m[2];

  const sm = /^skill:(.+?):(\d+)$/.exec(text);
  if (sm) {
    const name = sm[1].trim();
    const pct = parseInt(sm[2], 10);
    const filled = Math.round(pct / 5);
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
    return `<div class="line skill-line"><span class="name">${escapeHtml(
      name
    )}</span><span class="barwrap">[<span class="bar">${bar}</span>]</span><span class="pct">${pct}%</span></div>`;
  }

  let safe = escapeHtml(text);
  safe = safe.replace(
    /link\|([^|\s]+)\|([^\n]+)$/g,
    '<a href="$1" target="_blank" rel="noreferrer">$2</a>'
  );
  safe = safe.replace(
    /link\|([^|\s]+)/g,
    '<a href="$1" target="_blank" rel="noreferrer">$1</a>'
  );
  return `<div class="line ${cls}">${safe}</div>`;
}

interface ScreenItem {
  id: number;
  html: string;
}

let __id = 0;
const nextId = () => ++__id;

export default function Terminal() {
  const [view, setView] = useState<View>('terminal');
  const [cwd, setCwd] = useState('/');
  const [screen, setScreen] = useState<ScreenItem[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [time, setTime] = useState('');
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 4,
    width: 0,
  });

  const cwdRef = useRef('/');
  cwdRef.current = cwd;
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const histIdx = useRef<number>(-1);
  const [inputValue, setInputValue] = useState('');
  const toggleRef = useRef<HTMLDivElement>(null);
  const termBtnRef = useRef<HTMLButtonElement>(null);
  const docBtnRef = useRef<HTMLButtonElement>(null);

  /* ---------- screen helpers ---------- */
  const pushHtml = useCallback((html: string) => {
    setScreen((s) => [...s, { id: nextId(), html }]);
  }, []);
  const pushLine = useCallback(
    (html: string, cls = '') => pushHtml(`<div class="line ${cls}">${html}</div>`),
    [pushHtml]
  );
  const pushSpacer = useCallback(() => pushHtml('<div class="sp"></div>'), [pushHtml]);

  /* ---------- commands ---------- */
  const runLs = useCallback(
    (args: string[]) => {
      const target = args[0] ? normalize(args[0], cwdRef.current) : cwdRef.current;
      if (!exists(target)) {
        pushLine(`<span class="r">ls:</span> ${escapeHtml(target)}: No such file or directory`);
        return;
      }
      const node = FS[target];
      if (node.type === 'file') {
        const parts = target.split('/');
        pushLine(`<span class="w">${escapeHtml(parts[parts.length - 1])}</span>`);
        return;
      }
      const items = node.children;
      const spans = items.map((it) => {
        const isD = it.endsWith('/');
        const name = it.replace(/\/$/, '');
        let cls = 'file';
        if (isD) cls = 'dir';
        else if (name.endsWith('.md')) cls = 'md';
        else {
          const child = FS[(target === '/' ? '' : target) + '/' + name];
          if (child && child.type === 'file' && child.kind === 'exe') cls = 'exe';
        }
        return `<span class="${cls}">${escapeHtml(name)}</span>`;
      });
      pushHtml(`<div class="line ls-row">${spans.join('')}</div>`);
    },
    [pushHtml, pushLine]
  );

  const runCd = useCallback(
    (args: string[]) => {
      if (!args[0] || args[0] === '~') {
        setCwd('/');
        return;
      }
      const target = normalize(args[0], cwdRef.current);
      if (!exists(target)) {
        pushLine(`<span class="r">cd:</span> no such directory: ${escapeHtml(args[0])}`);
        return;
      }
      if (!isDir(target)) {
        pushLine(`<span class="r">cd:</span> not a directory: ${escapeHtml(args[0])}`);
        return;
      }
      setCwd(target);
    },
    [pushLine]
  );

  const runCat = useCallback(
    (args: string[]) => {
      if (!args[0]) return pushLine(`<span class="r">cat:</span> usage: cat &lt;file&gt;`);
      const target = normalize(args[0], cwdRef.current);
      if (!exists(target))
        return pushLine(
          `<span class="r">cat:</span> ${escapeHtml(args[0])}: No such file or directory`
        );
      if (isDir(target))
        return pushLine(`<span class="r">cat:</span> ${escapeHtml(args[0])}: Is a directory`);
      const file = FS[target] as Extract<FsNode, { type: 'file' }>;
      pushSpacer();
      const lines = file.body().map(renderLineEntryHtml).join('');
      const meta = escapeHtml(file.meta || file.kind || '');
      pushHtml(
        `<div class="line"><div class="file-out"><div class="fo-head"><span class="p">${escapeHtml(
          target
        )}</span><span class="meta">${meta}</span></div>${lines}</div></div>`
      );
      pushSpacer();
    },
    [pushHtml, pushLine, pushSpacer]
  );

  const runTree = useCallback(() => {
    pushSpacer();
    let html = '<span class="dir">~</span>\n';
    const top = (FS['/'] as Extract<FsNode, { type: 'dir' }>).children;
    top.forEach((it, i) => {
      const last = i === top.length - 1;
      const branch = last ? '└── ' : '├── ';
      const isD = it.endsWith('/');
      const name = it.replace(/\/$/, '');
      const cls = isD ? 'dir' : name.endsWith('.md') ? 'md' : 'file';
      html += `${branch}<span class="${cls}">${escapeHtml(name)}${isD ? '/' : ''}</span>\n`;
      if (isD) {
        const subs = (FS['/' + name] as Extract<FsNode, { type: 'dir' }>).children;
        subs.forEach((s, j) => {
          const sLast = j === subs.length - 1;
          const stem = last ? '    ' : '│   ';
          const sBranch = sLast ? '└── ' : '├── ';
          const sIsD = s.endsWith('/');
          const sName = s.replace(/\/$/, '');
          const sCls = sIsD ? 'dir' : sName.endsWith('.md') ? 'md' : 'file';
          html += `${stem}${sBranch}<span class="${sCls}">${escapeHtml(sName)}${
            sIsD ? '/' : ''
          }</span>\n`;
        });
      }
    });
    pushHtml(`<div class="line tree">${html}</div>`);
    pushSpacer();
  }, [pushHtml, pushSpacer]);

  const runWhoami = useCallback(() => {
    pushSpacer();
    (FS['/whoami'] as Extract<FsNode, { type: 'file' }>)
      .body()
      .forEach((e) => pushHtml(renderLineEntryHtml(e)));
    pushSpacer();
  }, [pushHtml, pushSpacer]);

  const runNeofetch = useCallback(() => {
    pushSpacer();
    const lines = [
      'line:g|       michal@portfolio',
      'line:dim|       ─────────────────',
      'line:|  os    :  y|michal-os v26.05 (msu-build)',
      'line:|  host  :  c|MacBook · M-series',
      'line:|  shell :  c|zsh 5.9',
      'line:|  role  :  m|AI Engineer · ML & Quantitative Systems',
      'line:|  edu   :  m|B.S. Computational Data Science · MSU',
      'line:|  minor :  m|Mathematics · GPA 3.80',
      'line:|  grads :  o|May 2026',
      'line:|  loc   :  c|East Lansing, MI · any US state',
      'line:|  email :  c|borekmi1@msu.edu',
      'line:|  phone :  c|(517) 980-3231',
      'line:|  langs :  c|Polish (native) · English (fluent)',
      'line:|  pubs  :  y|SPIE 2025 · Radiology: AI (review) · Mid-SURE',
      'line:|  stack :  c|python · pytorch · fastapi · ollama · qdrant',
      'line:|  uptime:  g|open_to_work',
    ];
    lines.forEach((e) => pushHtml(renderLineEntryHtml(e)));
    pushSpacer();
  }, [pushHtml, pushSpacer]);

  const runHelp = useCallback(() => {
    pushLine('<span class="y">commands</span><span class="dim">  ──────────────────────────────────────────────</span>');
    const rows: Array<[string, string]> = [
      ['ls [path]', 'list directory'],
      ['cd <dir>', 'change directory · .. up · / root · ~ home'],
      ['cat <file>', 'print a file'],
      ['pwd', 'print working directory'],
      ['tree', 'show the whole résumé tree'],
      ['whoami', 'one-line bio'],
      ['neofetch', 'system info card'],
      ['contact', 'shortcut for `cat /contact/info`'],
      ['clear', 'clear the screen'],
      ['banner', 'reprint the welcome banner'],
      ['help', 'this list'],
    ];
    rows.forEach(([c, d]) =>
      pushHtml(
        `<div class="line">  <span class="g">${c.padEnd(18)}</span><span class="dim">${escapeHtml(
          d
        )}</span></div>`
      )
    );
    pushLine('');
    pushLine(
      '<span class="dim">tip · </span><kbd>Tab</kbd> <span class="dim">complete  ·  </span><kbd>↑↓</kbd> <span class="dim">history  ·  click any item in the sidebar</span>'
    );
  }, [pushHtml, pushLine]);

  const printBanner = useCallback(() => {
    const html = `
      <div class="banner-card">
        <div class="bc-top">
          <span class="bc-prompt">▸</span>
          <span class="bc-name">MICHAL BOREK</span><span class="bc-cur">_</span>
          <span class="bc-status">[●] open_to_work</span>
        </div>
        <div class="bc-role">ai engineer · machine learning &amp; quantitative systems</div>
        <div class="bc-grid">
          <span class="bc-k">grad</span><span class="bc-v">may 2026 · MSU · CDS + math minor · GPA 3.80</span>
          <span class="bc-k">stack</span><span class="bc-v">python · pytorch · fastapi · ollama · qdrant · slurm</span>
          <span class="bc-k">github</span><span class="bc-v"><a href="https://github.com/michaelborek" target="_blank" rel="noreferrer">github.com/michaelborek</a></span>
          <span class="bc-k">email</span><span class="bc-v"><a href="mailto:borekmi1@msu.edu">borekmi1@msu.edu</a></span>
        </div>
      </div>
    `;
    pushHtml(`<div class="line">${html}</div>`);
    pushHtml(
      `<div class="line"><div class="hint">A portfolio that boots. Try <b>tree</b>, <b>cd projects && ls</b>, or click anything in the <b>sidebar →</b></div></div>`
    );
    pushSpacer();
  }, [pushHtml, pushSpacer]);

  /* ---------- frozen prompt + dispatch ---------- */
  const freezePrompt = useCallback(
    (raw: string) => {
      const cw = shortCwd(cwdRef.current);
      pushHtml(
        `<div class="line"><span class="prompt">${USER}<span class="at">@</span>${HOST}</span> <span class="prompt path">${cw}</span> <span class="prompt branch">⎇ open-to-work</span> <span class="prompt arrow">❯</span> <span class="cmd">${escapeHtml(
          raw
        )}</span></div>`
      );
    },
    [pushHtml]
  );

  const runCommandRaw = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const parts = trimmed.split('&&').map((s) => s.trim()).filter(Boolean);
      parts.forEach((p) => {
        const tokens = p.split(/\s+/);
        const cmd = tokens[0];
        const args = tokens.slice(1);
        switch (cmd) {
          case 'help':
            runHelp();
            break;
          case 'pwd':
            pushLine(`<span class="b">${cwdRef.current === '/' ? '/' : cwdRef.current}</span>`);
            break;
          case 'ls':
            runLs(args);
            break;
          case 'cd':
            runCd(args);
            break;
          case 'cat':
            runCat(args);
            break;
          case 'tree':
            runTree();
            break;
          case 'whoami':
            runWhoami();
            break;
          case 'neofetch':
            runNeofetch();
            break;
          case 'contact':
            runCat(['/contact/info']);
            break;
          case 'clear':
            setScreen([]);
            break;
          case 'banner':
            printBanner();
            break;
          default:
            pushLine(
              `<span class="r">zsh:</span> command not found: ${escapeHtml(cmd)}<span class="dim"> — try </span><span class="g">help</span>`
            );
        }
      });
    },
    [pushLine, runLs, runCd, runCat, runTree, runWhoami, runNeofetch, runHelp, printBanner]
  );

  const submitInput = useCallback(
    (raw: string) => {
      freezePrompt(raw);
      if (raw.trim()) {
        history.current.push(raw);
        histIdx.current = history.current.length;
      }
      runCommandRaw(raw);
    },
    [freezePrompt, runCommandRaw]
  );

  /* ---------- sidebar click handlers ---------- */
  const onSidebarFile = useCallback(
    (path: string) => {
      submitInput(`cat ${path}`);
      inputRef.current?.focus();
    },
    [submitInput]
  );
  const onSidebarDir = useCallback(
    (path: string) => {
      freezePrompt(`cd ${path} && ls`);
      setCwd(path);
      cwdRef.current = path;
      runLs([]);
      pushSpacer();
      inputRef.current?.focus();
    },
    [freezePrompt, runLs, pushSpacer]
  );
  const onQuickRun = useCallback(
    (cmd: string) => {
      submitInput(cmd);
      inputRef.current?.focus();
    },
    [submitInput]
  );

  /* ---------- input handlers ---------- */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const raw = inputValue;
      setInputValue('');
      submitInput(raw);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (!history.current.length) return;
      histIdx.current = Math.max(0, histIdx.current - 1);
      setInputValue(history.current[histIdx.current] || '');
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (!history.current.length) return;
      histIdx.current = Math.min(history.current.length, histIdx.current + 1);
      setInputValue(history.current[histIdx.current] || '');
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const v = inputValue;
      const tokens = v.split(/\s+/);
      const COMMANDS = [
        'help',
        'pwd',
        'ls',
        'cd',
        'cat',
        'tree',
        'whoami',
        'neofetch',
        'contact',
        'clear',
        'banner',
      ];
      if (tokens.length === 1) {
        const cands = COMMANDS.filter((c) => c.startsWith(tokens[0]));
        if (cands.length === 1) setInputValue(cands[0] + ' ');
        else if (cands.length > 1) pushLine('<span class="dim">' + cands.join('  ') + '</span>');
      } else {
        const last = tokens[tokens.length - 1];
        const slash = last.lastIndexOf('/');
        const dirPart = slash >= 0 ? last.slice(0, slash + 1) : '';
        const partial = slash >= 0 ? last.slice(slash + 1) : last;
        const base = dirPart === '' ? cwdRef.current : normalize(dirPart, cwdRef.current);
        const node = FS[base];
        if (node && node.type === 'dir') {
          const cands = node.children
            .map((c) => c.replace(/\/$/, ''))
            .filter((c) => c.startsWith(partial));
          if (cands.length === 1) {
            const isD = node.children.includes(cands[0] + '/');
            tokens[tokens.length - 1] = dirPart + cands[0] + (isD ? '/' : '');
            setInputValue(tokens.join(' '));
          } else if (cands.length > 1) {
            pushLine('<span class="dim">' + cands.join('  ') + '</span>');
          }
        }
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setScreen([]);
    }
  };

  /* ---------- effects ---------- */
  // Boot sequence (once)
  useEffect(() => {
    let cancelled = false;
    const lines: Array<[string, number]> = [
      ['<span class="dim">[ 0.001 ] init :: michal-os booting...</span>', 70],
      ['<span class="dim">[ 0.038 ] kernel :: loading résumé modules</span>', 70],
      [
        '<span class="dim">[ 0.092 ] mount :: /about /education /experience /projects /publications /skills /contact</span>',
        80,
      ],
      ['<span class="dim">[ 0.140 ] systemd[1] :: started open-to-work.service</span>', 80],
      ['<span class="g">[ 0.211 ] OK :: hire-readiness checks passed</span>', 180],
    ];
    (async () => {
      for (const [html, ms] of lines) {
        if (cancelled) return;
        pushLine(html);
        await new Promise((r) => setTimeout(r, ms));
      }
      if (cancelled) return;
      pushSpacer();
      printBanner();
      setBootDone(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll on screen change
  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [screen]);

  // Clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Toggle pill placement
  useEffect(() => {
    const place = () => {
      const target = view === 'terminal' ? termBtnRef.current : docBtnRef.current;
      const parent = toggleRef.current;
      if (!target || !parent) return;
      const t = target.getBoundingClientRect();
      const p = parent.getBoundingClientRect();
      setPillStyle({ left: t.left - p.left, width: t.width });
    };
    place();
    const id = window.setTimeout(place, 80);
    window.addEventListener('resize', place);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', place);
    };
  }, [view]);

  // Focus input when terminal becomes active and boot completes
  useEffect(() => {
    if (view === 'terminal' && bootDone) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [view, bootDone]);

  /* ---------- sidebar render ---------- */
  const top = (FS['/'] as Extract<FsNode, { type: 'dir' }>).children;
  const sidebarTree = useMemo(() => {
    return top.map((it) => {
      const isD = it.endsWith('/');
      const name = it.replace(/\/$/, '');
      if (!isD) {
        const path = '/' + name;
        const isMD = name.endsWith('.md');
        return (
          <div
            key={path}
            className={`sb-item${name === 'whoami' ? ' star' : ''}`}
            onClick={() => onSidebarFile(path)}
          >
            <span className={`ico ${isMD ? 'md' : 'f'}`}>{isMD ? '⌘' : '▸'}</span>
            <span>{name}</span>
          </div>
        );
      }
      const path = '/' + name;
      const dir = FS[path] as Extract<FsNode, { type: 'dir' }>;
      return (
        <div key={path}>
          <div className="sb-folder-h" onClick={() => onSidebarDir(path)}>
            <span className="ico">▾</span>
            <span className="nm">{name}</span>
          </div>
          <div className="sb-children">
            {dir.children.map((c) => {
              const cName = c.replace(/\/$/, '');
              const cPath = path + '/' + cName;
              const isMD = cName.endsWith('.md');
              const star = cName.includes('ai-auto-caller');
              return (
                <div key={cPath} className="sb-item" onClick={() => onSidebarFile(cPath)}>
                  <span className={`ico ${isMD ? 'md' : 'f'}`}>{isMD ? '⌘' : '▸'}</span>
                  <span>{cName}</span>
                  {star && <span className="star-mark">★</span>}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSidebarDir, onSidebarFile]);

  return (
    <>
      <div className="wallpaper" />
      <MatrixRain />
      <div className="crt-overlay" aria-hidden />

      <header className="topbar">
        <div className="brand-mini">
          <span className="bm-seg">[ <span className="bm-k">michal@msu</span> ]</span>
          <span className="bm-sep">─</span>
          <span className="bm-seg">[ <span className="bm-p">~/portfolio</span> ]</span>
          <span className="bm-sep">─</span>
          <span className="bm-seg">[ <span className="bm-b">⎇ open-to-work</span> ]</span>
          <span className="bm-cur" />
        </div>

        <div className="toggle" role="tablist" aria-label="View switch" ref={toggleRef}>
          <span
            className="pill"
            style={{ left: pillStyle.left + 'px', width: pillStyle.width + 'px' }}
          />
          <button
            ref={termBtnRef}
            className={view === 'terminal' ? 'active' : ''}
            role="tab"
            aria-selected={view === 'terminal'}
            onClick={() => setView('terminal')}
          >
            <span className="ico">⌗</span>
            <span>Terminal</span>
          </button>
          <button
            ref={docBtnRef}
            className={view === 'doc' ? 'active' : ''}
            role="tab"
            aria-selected={view === 'doc'}
            onClick={() => setView('doc')}
          >
            <span className="ico">▤</span>
            <span>Document</span>
          </button>
        </div>
      </header>

      {/* TERMINAL VIEW */}
      <section className="view view-term" hidden={view !== 'terminal'}>
        <div className="term">
          <div className="titlebar">
            <div className="traffic">
              <span className="r" />
              <span className="y" />
              <span className="g" />
            </div>
            <div className="title">
              <span className="dim">~</span>
              <span className="sep">／</span>
              <b>michal/portfolio{cwd === '/' ? '' : cwd}</b>
              <span className="sep">·</span>
              <span className="dim">zsh — 120×42</span>
            </div>
          </div>

          <div className="term-body">
            <aside className="sidebar">
              <div className="sb-portrait">
                <pre className="sb-ascii" aria-hidden>{`█▀▄▀█ █▄▄
█ ▀ █ █▄█`}</pre>
                <div className="sb-who">
                  <div className="sb-name">MICHAL BOREK</div>
                  <div className="sb-tag">ai · ml · quant systems</div>
                  <div className="sb-status"><span className="sb-blip" /> open_to_work</div>
                </div>
              </div>

              <div className="sb-quick">
                <div className="sb-h" style={{ margin: '0 0 4px', padding: 0 }}>
                  ★ Quick nav
                </div>
                <div className="sb-item" onClick={() => onQuickRun('whoami')}>
                  <span className="ico">⌘</span>
                  <span className="k">whoami</span>
                </div>
                <div className="sb-item" onClick={() => onQuickRun('neofetch')}>
                  <span className="ico">⌘</span>
                  <span className="k">neofetch</span>
                </div>
                <div className="sb-item" onClick={() => onQuickRun('tree')}>
                  <span className="ico">⌘</span>
                  <span className="k">tree</span>
                </div>
                <div className="sb-item" onClick={() => onQuickRun('cat /contact/info')}>
                  <span className="ico">⌘</span>
                  <span className="k">contact</span>
                </div>
              </div>

              <div className="sb-h">Filesystem</div>
              <div>{sidebarTree}</div>
            </aside>

            <div className="screen-wrap">
              <div
                className="screen"
                ref={screenRef}
                onClick={() => inputRef.current?.focus()}
              >
                {screen.map((it) => (
                  <div key={it.id} dangerouslySetInnerHTML={{ __html: it.html }} />
                ))}
                {bootDone && (
                  <div className="line input-row">
                    <span className="prompt">
                      {USER}
                      <span className="at">@</span>
                      {HOST}
                    </span>{' '}
                    <span className="prompt path">{shortCwd(cwd)}</span>{' '}
                    <span className="prompt branch">⎇ open-to-work</span>{' '}
                    <span className="prompt arrow">❯</span>{' '}
                    <input
                      ref={inputRef}
                      className="ic"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={onKeyDown}
                      autoCapitalize="off"
                      autoCorrect="off"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>

              <div className="statusbar">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="seg">
                    <span className="dot" />
                    <span className="ok">ONLINE</span>
                  </span>
                  <span className="seg">
                    <span className="path">{shortCwd(cwd)}</span>
                  </span>
                  <span className="seg">
                    ⎇ <span className="branch">open-to-work</span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="seg">
                    <kbd>Tab</kbd> complete
                  </span>
                  <span className="seg">
                    <kbd>↑↓</kbd> history
                  </span>
                  <span className="seg">{time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT VIEW */}
      <section className="view view-doc" hidden={view !== 'doc'}>
        <article className="doc">
          <header className="doc-head">
            <div>
              <h1>Michal Borek</h1>
              <div className="role">
                AI Engineer ·{' '}
                <span className="k">Machine Learning &amp; Quantitative Systems</span>
              </div>
            </div>
            <div className="doc-contact">
              <a href="mailto:borekmi1@msu.edu">borekmi1@msu.edu</a>
              <span>(517) 980-3231</span>
              <a href="https://github.com/michaelborek" target="_blank" rel="noreferrer">
                github.com/michaelborek
              </a>
              <a
                href="https://linkedin.com/in/michal-borek2003"
                target="_blank"
                rel="noreferrer"
              >
                linkedin/michal-borek2003
              </a>
              <a href={getAssetPath('/resume.pdf')} target="_blank" rel="noreferrer">
                resume.pdf
              </a>
              <span>East Lansing, MI · open to any US state</span>
              <span>Polish (native) · English (fluent)</span>
              <span className="pill">
                <span className="d" />
                OPEN TO WORK · SUMMER 2026
              </span>
            </div>
          </header>

          <div className="doc-body">
            <main>
              <h2>Summary</h2>
              <p className="lead">
                AI Engineer with strong quantitative and software-engineering foundations,
                focused on building reliable AI systems, machine-learning pipelines, and
                automation tools for real-world workflows. Experienced in deep learning,
                LLM applications, RAG systems, medical-imaging ML, HPC tooling, voice-AI
                automation, and client-facing data science. Strong in Python, SQL, PyTorch,
                backend development, model evaluation, validation, and translating
                ambiguous technical problems into practical AI solutions with measurable
                impact.
              </p>

              <h2>Experience</h2>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">
                      Deep Learning Research Assistant — Medical Imaging ML
                    </div>
                    <div className="org">
                      Institute for Quantitative Health Science &amp; Engineering · Michigan State University
                    </div>
                  </div>
                  <div className="date">Nov 2023 — Present</div>
                </div>
                <ul>
                  <li>
                    Built a modular <b>PyTorch</b> pipeline for ordinal medical image
                    classification, supporting reproducible data curation, training,
                    evaluation, and automatic reporting.
                  </li>
                  <li>
                    Led hyperparameter optimization and model selection using held-out
                    metrics, calibration analysis, and structured performance tracking.
                  </li>
                  <li>
                    Scaled training with <b>PyTorch DDP</b> on CUDA/SLURM — reduced wall
                    time from <b style={{ color: 'var(--ink)' }}>~8 h to ~3 h</b>.
                  </li>
                  <li>
                    Improved preprocessing efficiency (image resizing + pipeline design)
                    for large-scale chest-X-ray experiments.
                  </li>
                  <li>
                    Supported clinical model review with <b>Captum</b>-based saliency
                    analysis for interpretability.
                  </li>
                  <li>
                    Contributed to research disseminated through{' '}
                    <b>SPIE Medical Imaging 2025</b> and a{' '}
                    <b>Radiology: Artificial Intelligence</b> manuscript currently under
                    review.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> PyTorch · PyTorch DDP · CUDA · SLURM · Captum · TorchXRayVision · scikit-learn · NumPy
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">AI Engineer Intern — HPC / ML Tooling</div>
                    <div className="org">
                      Institute for Cyber-Enabled Research · Michigan State University
                    </div>
                  </div>
                  <div className="date">Jun 2023 — May 2026</div>
                </div>
                <ul>
                  <li>
                    Shipped an AI-assisted <b>SLURM job-script validator</b> combining
                    custom #SBATCH checks, ShellCheck, and local-LLM review through
                    Ollama to reduce submission errors and speed user triage.
                  </li>
                  <li>
                    Deployed a <b>Flask service and CLI</b> on Open OnDemand with a live
                    script editor, real-time analysis, and a SLURM-focused chat assistant
                    for the HPCC user community.
                  </li>
                  <li>
                    Designed <b>policy-constrained LLM workflows</b> with approved checks,
                    controlled outputs, and validation logic to improve reliability and
                    reduce unsupported guidance.
                  </li>
                  <li>
                    Authored an HPCC module for <b>LM Studio</b> — one-command LLM
                    workflows under SLURM and local inference experiments on H200 GPUs.
                  </li>
                  <li>
                    Presented the AI agent at <b>Mid-SURE 2025</b> through a live demo
                    and Q&amp;A with faculty, students, and technical stakeholders.
                  </li>
                  <li>
                    Designed and delivered a <b>Python training track</b> for HPC users
                    covering programming fundamentals, OOP, NumPy, and project structure.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> Python · Flask · Ollama · LM Studio · SLURM · ShellCheck · Open OnDemand · Singularity · H200
                </div>
              </div>

              <h2>Projects</h2>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">
                      AI Auto-Caller for Outbound Prospecting
                      <span className="flagship-tag">★ FLAGSHIP</span>
                    </div>
                    <div className="org">Shipping desktop product · macOS</div>
                  </div>
                  <div className="date">Mar 2026 — Present</div>
                </div>
                <ul>
                  <li>
                    Built a local macOS desktop app using <b>Electron, React, FastAPI,
                    and SQLite</b> to automate outbound sales calls with the OpenAI
                    Realtime API and Twilio.
                  </li>
                  <li>
                    Shipped the product as a one-click <b>.dmg</b> with bundled ngrok,
                    allowing non-technical customers to run the system with zero
                    infrastructure setup.
                  </li>
                  <li>
                    Designed a <b>licensing and anti-piracy</b> system using a Cloudflare
                    Worker kill-switch with HMAC-signed responses.
                  </li>
                  <li>
                    Validated against a <b>Level-2 pentest</b> and closed all{' '}
                    <b style={{ color: 'var(--ink)' }}>8 identified attack vectors</b>.
                  </li>
                  <li>
                    Built a production-grade release pipeline with{' '}
                    <b>137 passing Python tests</b>, automated release scripts, and a
                    Nuitka-compiled engine binary of ~60 MB.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> Electron · React · FastAPI · SQLite · OpenAI Realtime API · Twilio · Cloudflare Workers · ngrok · Nuitka
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">Legal Document Intelligence System</div>
                    <div className="org">
                      End-to-end RAG · github.com/michaelborek/Law-Assistant
                    </div>
                  </div>
                  <div className="date">Dec 2025 — Feb 2026</div>
                </div>
                <ul>
                  <li>
                    Built an end-to-end RAG system for PDF, DOCX, and TXT legal documents
                    with <b>citation-backed answers</b> using PostgreSQL Full-Text Search,
                    Qdrant, and local Ollama inference.
                  </li>
                  <li>
                    Implemented <b>structured outputs, verification/refusal logic</b>,
                    claim-to-source validation, excerpt generation, audit logging,
                    retries, and safe concurrency.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> Python · FastAPI · Next.js · PostgreSQL FTS · Qdrant · Ollama · Llama 3.1
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">
                      Delta Dental Capstone — Project Lead{' '}
                      <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>
                        (Client-Facing Data Science)
                      </span>
                    </div>
                    <div className="org">Delta Dental Data Science Team · MSU capstone</div>
                  </div>
                  <div className="date">Jan 2026 — Apr 2026</div>
                </div>
                <ul>
                  <li>
                    Led a partner-sponsored data-science capstone with the Delta Dental
                    Data Science Team — coordinated scope, milestones, working sessions,
                    and stakeholder updates.
                  </li>
                  <li>
                    Built a <b>canonical dataset</b> by consolidating source tables into
                    a stable schema and data dictionary for downstream analytics.
                  </li>
                  <li>
                    Prototyped <b>feature mapping into a 3D model</b> to improve
                    interpretability, visualization, and feature semantics.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> Python · Pandas · SQL · 3D visualization · stakeholder management
                </div>
              </div>

              <h2>Publications</h2>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">
                      Ordinal classification framework for multiclass grading of pneumoconiosis
                    </div>
                    <div className="org">
                      Liu, M., Loveless, I., Huang, Z., <b>Borek, M.</b>, Rosenman, K., Alessio, A., Wang, L.
                    </div>
                  </div>
                  <div className="date">SPIE 2025</div>
                </div>
                <div className="stack">
                  <b>SPIE Medical Imaging 2025: Computer-Aided Diagnosis</b>, 13407:134072Q · April 2025 ·{' '}
                  <a
                    href="https://doi.org/10.1117/12.3046353"
                    target="_blank"
                    rel="noreferrer"
                  >
                    doi:10.1117/12.3046353
                  </a>
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">
                      Pneumoconiosis Multi-task Screening and Classification using Fine-Tuned Deep Learning Models
                    </div>
                    <div className="org">
                      Wang, L., Liu, M., Huang, Z., Loveless, I., <b>Borek, M.</b>, Rosenman, K., Alessio, A.
                    </div>
                  </div>
                  <div className="date">2025</div>
                </div>
                <div className="stack">
                  <b>Radiology: Artificial Intelligence</b> · under review
                </div>
              </div>
            </main>

            <aside className="doc-side">
              <h2>Education</h2>
              <div className="edu-block">
                <div className="t">B.S. Computational Data Science</div>
                <div className="org">Minor in Mathematics</div>
                <div className="org" style={{ color: 'var(--ink-2)', marginTop: 2 }}>
                  Michigan State University · College of Engineering
                </div>
                <div className="date">Aug 2022 — Expected May 2026</div>
                <div className="detail">GPA: <b style={{ color: 'var(--ink)' }}>3.80</b></div>
                <div className="detail">
                  Coursework: Deep Learning · Linear Algebra · Numerical Methods ·
                  Distributed Systems · Probability · Real Analysis.
                </div>
              </div>

              <h2>Technical Skills</h2>
              <div className="group">
                <div className="skills-h">Languages</div>
                <div className="detail">Python · C++ · SQL · Bash</div>
              </div>
              <div className="group">
                <div className="skills-h">AI / ML</div>
                <div className="detail">
                  PyTorch · scikit-learn · TorchXRayVision · Captum · classification ·
                  model evaluation · hyperparameter tuning · calibration
                </div>
              </div>
              <div className="group">
                <div className="skills-h">Quantitative / Data</div>
                <div className="detail">
                  Pandas · NumPy · statistical analysis · feature engineering · F1-score ·
                  confusion matrices
                </div>
              </div>
              <div className="group">
                <div className="skills-h">LLM / RAG</div>
                <div className="detail">
                  OpenAI Realtime API · Ollama · Qdrant · PostgreSQL FTS · citation-backed
                  RAG · structured outputs · verification/refusal patterns
                </div>
              </div>
              <div className="group">
                <div className="skills-h">Backend / Systems</div>
                <div className="detail">
                  FastAPI · Flask · Docker · Git · Linux · REST APIs · SQLite
                </div>
              </div>
              <div className="group">
                <div className="skills-h">Product / Automation</div>
                <div className="detail">
                  Twilio · Electron · React · Cloudflare Workers · ngrok · Nuitka ·
                  ShellCheck · Jupyter
                </div>
              </div>
              <div className="group">
                <div className="skills-h">HPC / Distributed</div>
                <div className="detail">
                  SLURM · CUDA · PyTorch DDP · Singularity · MSU HPCC
                </div>
              </div>

              <h2>Leadership &amp; Awards</h2>
              <div className="pub">
                <div className="t">Resident Assistant — MSU Housing &amp; Residence Education</div>
                <div className="v">
                  Aug 2024 — May 2026 · 100+ residents · REHS Excellent Teamwork Award (2025)
                </div>
              </div>
              <div className="pub">
                <div className="t">Co-Founder · Polish Club, Michigan State University</div>
                <div className="v">Oct 2024 — May 2026 · Executive Board Member</div>
              </div>
              <div className="pub">
                <div className="t">Awards</div>
                <div className="v">
                  Dean&apos;s List (7 / 8 terms) · EGRID Silver Scholarship (2024) ·
                  International Tuition Grant (2022)
                </div>
              </div>
            </aside>
          </div>

          <footer className="doc-foot">
            <span>© 2026 · Michal Borek</span>
            <span>page 1 / 1 · build · resume.zsh</span>
          </footer>
        </article>
      </section>

      {/* Hidden portrait kept so static export resolves the asset (and for future use) */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden>
        <Image
          src={getAssetPath('/pixel_me.png')}
          alt=""
          width={1}
          height={1}
          priority={false}
        />
      </div>
    </>
  );
}
