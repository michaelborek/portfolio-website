'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { getAssetPath } from '../../utils/basePath';
import { FS, HOST, USER, type FsNode } from './data';

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
      'line:|  role  :  m|ML Engineer · AI Consultant',
      'line:|  edu   :  m|B.S. Computational Data Science · MSU',
      'line:|  minor :  m|Mathematics',
      'line:|  grads :  o|Spring 2026',
      'line:|  loc   :  c|East Lansing, MI · any US state',
      'line:|  email :  c|borekmi1@msu.edu',
      'line:|  pubs  :  y|2 · SPIE · iCER MidSURE',
      'line:|  cpu   :  c|10y python · 4y deep-learning · ∞ curiosity',
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
        <div class="av-big">M</div>
        <div class="who-big">
          <div class="nm">Michal Borek</div>
          <div class="rl">● ML Engineer · AI Consultant · Researcher</div>
          <div class="lk"><a href="https://github.com/michaelborek" target="_blank" rel="noreferrer">github.com/michaelborek</a> · <a href="mailto:borekmi1@msu.edu">borekmi1@msu.edu</a> · MSU Spring '26 · open to any US state</div>
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
              const star = cName.includes('law-assistant');
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

      <header className="topbar">
        <div className="brand-mini">
          <div className="mark">M</div>
          <span>
            <b>michal borek</b>
            <span className="dim"> · portfolio</span>
          </span>
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
                <div className="av">M</div>
                <div className="who">
                  <div className="nm">Michal Borek</div>
                  <div className="rl">● open_to_work</div>
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
                Machine Learning Engineer ·{' '}
                <span className="k">AI Consultant · Researcher</span>
              </div>
            </div>
            <div className="doc-contact">
              <a href="mailto:borekmi1@msu.edu">borekmi1@msu.edu</a>
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
                ML Engineer graduating from Michigan State University with a B.S. in
                Computational Data Science and a Mathematics minor. I build end-to-end AI
                systems — RAG pipelines, computer-vision models, full-stack applications
                — and ship them. Two peer-reviewed publications. Looking for MLE / AI
                Engineer roles starting Summer 2026.
              </p>

              <h2>Experience</h2>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">Undergraduate Research Assistant</div>
                    <div className="org">
                      iCER — Institute for Cyber-Enabled Research · Michigan State University
                    </div>
                  </div>
                  <div className="date">2024 — 2025</div>
                </div>
                <ul>
                  <li>
                    Co-designed an agentic-AI framework that validates SLURM batch-job
                    scripts before submission, catching misconfigurations, GPU mismatches,
                    and bad partitions.
                  </li>
                  <li>
                    Built the evaluation harness and a dataset of broken job scripts for
                    benchmarking.
                  </li>
                  <li>Presented the work at iCER MidSURE 2025.</li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> Python · LLM tool-use · SLURM · pytest
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">TA Tooling — AUTO-GRADER</div>
                    <div className="org">Computational Data Science · MSU</div>
                  </div>
                  <div className="date">2023 — present</div>
                </div>
                <ul>
                  <li>
                    Built an automated grading system that runs student submissions
                    against unittest suites in isolated Linux environments — used weekly
                    by a 100+ student class.
                  </li>
                  <li>
                    Designed structured diff output so students see exactly which test
                    failed and why.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> Python · unittest · Linux · bash · subprocess
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">Independent ML Consulting</div>
                    <div className="org">Self-employed · remote</div>
                  </div>
                  <div className="date">2024 — present</div>
                </div>
                <ul>
                  <li>
                    Short engagements building RAG/LLM systems and computer-vision models.
                    Comfortable with the whole loop: scoping, eval design, training,
                    deployment, monitoring.
                  </li>
                </ul>
              </div>

              <h2>Selected Projects</h2>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">
                      Law-Assistant — RAG Research Assistant
                      <span className="flagship-tag">★ FLAGSHIP</span>
                    </div>
                    <div className="org">
                      Open-source · github.com/michaelborek/Law-Assistant
                    </div>
                  </div>
                  <div className="date">v0.4.2 · 2025</div>
                </div>
                <ul>
                  <li>
                    Hybrid retrieval (PostgreSQL full-text + Qdrant vector) over legal
                    corpora, served by a FastAPI backend with a Next.js front. Generation
                    runs on a local Llama 3.1 via Ollama.
                  </li>
                  <li>
                    Every response passes through a citation-verification layer that
                    rejects claims not supported by retrieved evidence — making
                    hallucinations structurally impossible.
                  </li>
                  <li>12,442 chunks indexed in production.</li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> Python · FastAPI · Next.js · PostgreSQL · Qdrant · Ollama
                  · Llama 3.1
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">DarkVision — Low-light CV</div>
                    <div className="org">github.com/michaelborek/DarkVision</div>
                  </div>
                  <div className="date">2024</div>
                </div>
                <ul>
                  <li>
                    Fine-tuned ResNet-18 with custom data augmentation for darkness,
                    motion blur and IR-camera artifacts. Reached{' '}
                    <b style={{ color: 'var(--ink)' }}>92% accuracy</b> on the held-out
                    evaluation set.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> PyTorch · ResNet-18 · OpenCV · numpy
                </div>
              </div>

              <div className="item">
                <div className="item-head">
                  <div>
                    <div className="t">QSide-Notebook — Zero-install data viz</div>
                    <div className="org">github.com/michaelborek/QSide-Notebook</div>
                  </div>
                  <div className="date">2024</div>
                </div>
                <ul>
                  <li>
                    Fully client-side JupyterLite environment with SQL and Python kernels
                    for exploring and charting datasets without local setup.
                  </li>
                </ul>
                <div className="stack">
                  <b>Stack ·</b> JupyterLite · Python · SQL
                </div>
              </div>
            </main>

            <aside className="doc-side">
              <h2>Education</h2>
              <div className="edu-block">
                <div className="t">B.S. Computational Data Science</div>
                <div className="org">Mathematics minor</div>
                <div className="org" style={{ color: 'var(--ink-2)', marginTop: 2 }}>
                  Michigan State University
                </div>
                <div className="date">Aug 2022 — May 2026</div>
                <div className="detail">
                  Coursework: Deep Learning · Linear Algebra · Numerical Methods ·
                  Distributed Systems · Probability · Real Analysis.
                </div>
              </div>

              <h2>Publications</h2>
              <div className="pub">
                <div className="t">
                  Medical-Imaging Classification with Convolutional Neural Networks
                </div>
                <div className="v">SPIE Medical Imaging · peer-reviewed · co-author</div>
              </div>
              <div className="pub">
                <div className="t">
                  HPC Agentic-AI Framework for Batch Job Script Validation
                </div>
                <div className="v">iCER MidSURE 2025 · MSU · January 2025</div>
              </div>

              <h2>Skills</h2>
              <div className="group">
                <div className="skills-h">ML / AI</div>
                {[
                  ['Python', 5],
                  ['PyTorch', 4],
                  ['RAG / LLMs', 4],
                  ['Pandas / NumPy', 5],
                  ['Computer Vision', 4],
                ].map(([name, on]) => (
                  <div className="bar-row" key={name as string}>
                    <span className="name">{name}</span>
                    <span className="vis">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`seg${i < (on as number) ? ' on' : ''}`}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="group">
                <div className="skills-h">Engineering</div>
                {[
                  ['FastAPI', 4],
                  ['PostgreSQL', 4],
                  ['Next.js · React', 4],
                  ['Qdrant · vector DB', 4],
                  ['Linux / HPC', 4],
                ].map(([name, on]) => (
                  <div className="bar-row" key={name as string}>
                    <span className="name">{name}</span>
                    <span className="vis">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`seg${i < (on as number) ? ' on' : ''}`}
                        />
                      ))}
                    </span>
                  </div>
                ))}
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
