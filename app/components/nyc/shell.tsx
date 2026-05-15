'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AboutSection,
  ContactSection,
  FooterSection,
  HeroSection,
  ProjectsSection,
  ResearchSection,
  ResumeSection,
  SkillsSection,
} from './sections';
import {
  Bench,
  Cab,
  Companion,
  FbiAgent,
  Hydrant,
  Mailbox,
  Manhole,
  MichalWalk,
  TrashCan,
} from './sprites';

type Theme = 'day' | 'night';
type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'research' | 'resume' | 'contact';

const SECTION_IDS: SectionId[] = [
  'hero',
  'about',
  'skills',
  'projects',
  'research',
  'resume',
  'contact',
];

/* =========================================================================
   Live NYC clock
   ========================================================================= */
function NycClock() {
  const [parts, setParts] = useState<{ hour: string; minute: string; second: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      const p = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Detroit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
        .formatToParts(new Date())
        .reduce<Record<string, string>>((a, x) => ({ ...a, [x.type]: x.value }), {});
      setParts({ hour: p.hour, minute: p.minute, second: p.second });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="nyc-clock" title="Current time in East Lansing">
      <span className="tz">East Lansing</span>
      <span>
        {parts?.hour ?? '--'}
        <span className="colon">:</span>
        {parts?.minute ?? '--'}
        <span className="colon">:</span>
        {parts?.second ?? '--'}
      </span>
    </div>
  );
}

/* =========================================================================
   Sticky NavBar
   ========================================================================= */
function NavBar({
  active,
  onNav,
  theme,
  toggleTheme,
}: {
  active: SectionId;
  onNav: (id: SectionId) => void;
  theme: Theme;
  toggleTheme: () => void;
}) {
  const items: { id: SectionId; label: string }[] = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];
  return (
    <header className="nyc-nav">
      <div className="row">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNav('hero');
          }}
          className="brand"
        >
          <span className="sign">M</span>
          <span className="name">Michal Borek</span>
        </a>
        <nav className="links">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNav(it.id);
              }}
              className={active === it.id ? 'active' : ''}
            >
              {it.label}
            </a>
          ))}
        </nav>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <NycClock />
          <div className="status">
            <span className="dot" /> open to work
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'day' ? 'night' : 'day'} mode`}
            title={`Switch to ${theme === 'day' ? 'night' : 'day'} mode`}
          >
            <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg className="icon-moon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
            </svg>
            <span className="knob" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================================
   Walking Michal — scroll-tied horizontal motion
   ========================================================================= */
function Walker() {
  const [frame, setFrame] = useState(0);
  const [walking, setWalking] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const walkerRef = useRef<HTMLDivElement | null>(null);
  const compRef = useRef<HTMLDivElement | null>(null);
  const lastY = useRef(0);
  const lastDir = useRef<'down' | 'up'>('down');
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);
  // Track the latest computed positions so both the rAF tick (horizontal)
  // and the bob interval (companion's vertical) can write the same transform.
  const currentX = useRef(80);
  const compYRef = useRef(0);

  // Frame ticker — only runs while walking
  useEffect(() => {
    if (!walking) {
      setFrame(0);
      return;
    }
    const id = setInterval(() => setFrame((f) => (f === 1 ? 2 : 1)), 150);
    return () => clearInterval(id);
  }, [walking]);

  // Companion bob — pure interval, rewrites the same transform string as the
  // scroll handler so the two don't fight each other.
  useEffect(() => {
    const id = setInterval(() => {
      compYRef.current = compYRef.current ? 0 : -4;
      if (compRef.current) {
        compRef.current.style.transform = `translate3d(${currentX.current - 64}px, ${compYRef.current}px, 0)`;
      }
    }, 600);
    return () => clearInterval(id);
  }, []);

  // Single rAF-throttled scroll handler. The position lives on the DOM as an
  // inline transform — no React commits per scroll tick, so the navbar
  // highlight stays responsive and the walker actually moves smoothly.
  useEffect(() => {
    const compute = () => {
      rafId.current = null;
      const y = window.scrollY;
      const maxY = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, y / maxY));

      const left = 60;
      const right = Math.max(left + 120, window.innerWidth - 200);
      const x = left + (right - left) * pct;
      currentX.current = x;

      if (walkerRef.current) {
        walkerRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      if (compRef.current) {
        compRef.current.style.transform = `translate3d(${x - 64}px, ${compYRef.current}px, 0)`;
      }

      const dy = y - lastY.current;
      if (dy > 1 && lastDir.current !== 'down') {
        lastDir.current = 'down';
        setFlipped(false);
      } else if (dy < -1 && lastDir.current !== 'up') {
        lastDir.current = 'up';
        setFlipped(true);
      }
      lastY.current = y;

      setWalking(true);
      if (stopTimer.current) clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => setWalking(false), 220);
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Kick once after mount so the walker starts at the correct position.
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={walkerRef} className={`walker ${flipped ? 'flipped' : ''}`}>
        <MichalWalk frame={walking ? frame : 0} scale={4} />
      </div>
      <div ref={compRef} className="companion-walker">
        <Companion frame={walking ? frame % 2 : 0} scale={3} />
      </div>
    </>
  );
}

/* =========================================================================
   Street strip + drifting taxi + street props
   ========================================================================= */
function StreetStrip() {
  const [taxiKey, setTaxiKey] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTaxiKey((k) => k + 1), 14000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <div className="street-strip">
        <div className="sky-fade" />
        <div className="sidewalk" />
        <div className="street" />
      </div>
      <div className="taxi-drift" key={taxiKey} style={{ animationDelay: '0s' }}>
        <Cab scale={2.5} />
      </div>
      <div className="street-prop" style={{ left: '6%' }}>
        <Hydrant scale={2} />
      </div>
      <div className="street-prop" style={{ right: '20%' }}>
        <TrashCan scale={2} />
      </div>
      <div className="street-prop" style={{ left: '78%' }}>
        <Mailbox scale={2} />
      </div>
      <div className="street-prop" style={{ left: '46%' }}>
        <Bench scale={2} />
      </div>
    </>
  );
}

/* =========================================================================
   "Now Arriving" subway plaque — tracks active section
   ========================================================================= */
const STOPS: Record<SectionId, { name: string; meta: string }> = {
  hero: { name: 'Home', meta: 'EXPRESS · ARR NOW' },
  about: { name: 'About', meta: 'BLOCK 02 · LOCAL' },
  skills: { name: 'Skills', meta: 'BLOCK 03 · LOCAL' },
  projects: { name: 'Projects', meta: 'BLOCK 04 · EXPRESS' },
  research: { name: 'Research', meta: 'BLOCK 05 · LOCAL' },
  resume: { name: 'Resume', meta: 'BLOCK 06 · COMMENCEMENT' },
  contact: { name: 'Contact', meta: 'BLOCK 07 · LAST STOP' },
};
function NowArriving({ active }: { active: SectionId }) {
  const stop = STOPS[active];
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className={`now-arriving ${pulse ? 'pulse' : ''}`} aria-hidden="true">
      <div className="plaque">
        <div className="label">Now Arriving</div>
        <div className="station">▸ {stop.name}</div>
        <div className="meta">{stop.meta}</div>
      </div>
    </div>
  );
}

/* =========================================================================
   Floating nav dots (right edge)
   ========================================================================= */
function NavDots({ active, onNav }: { active: SectionId; onNav: (id: SectionId) => void }) {
  const items: { id: SectionId; name: string }[] = [
    { id: 'hero', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'skills', name: 'Skills' },
    { id: 'projects', name: 'Projects' },
    { id: 'research', name: 'Research' },
    { id: 'resume', name: 'Resume' },
    { id: 'contact', name: 'Contact' },
  ];
  return (
    <div className="nav-dots">
      {items.map((it) => (
        <a
          key={it.id}
          className={active === it.id ? 'active' : ''}
          onClick={() => onNav(it.id)}
          title={it.name}
          style={{ position: 'relative' }}
        >
          <span>{it.name}</span>
        </a>
      ))}
    </div>
  );
}

/* =========================================================================
   Agent Surveillance — fixed-position FBI agent pair that follows the
   visitor down the page. Cycles through "secret service" dialog bubbles,
   tracks scroll direction with the sunglasses gleam, and occasionally
   drops a targeting reticle on a random spot of the viewport.
   ========================================================================= */
const SUSPECT_LINES_A = [
  'SUBJECT ACQUIRED.',
  'EYES ON THE SCROLLER.',
  'TARGET IS READING THE DOSSIER.',
  'CHATTER LEVELS: ELEVATED.',
  'WE HAVE A LIVE ONE.',
  'POTENTIAL RECRUITER ON FRAME.',
  'DO NOT BLINK.',
  'SUSPECT SCROLLED PAST CHECKPOINT.',
  'MAINTAIN VISUAL.',
  'STAND BY, AGENT B.',
  'CONFIRM SCROLL VELOCITY.',
  'BRIEFCASE IS DEPLOYED.',
  'COPY THAT.',
  'MIKELE WANTS THIS ONE WATCHED.',
];
const SUSPECT_LINES_B = [
  'COPY. MAINTAINING VISUAL.',
  'TARGET HOVERED THE GITHUB LINK.',
  'SUSPECT IS ON BLOCK 04. EYES UP.',
  'NO SUDDEN MOVEMENTS.',
  'STAY VIGILANT.',
  'CLEARANCE PENDING.',
  'KEEP HIM IN FRAME.',
  'HE READ THE WHOLE DOSSIER. SUSPICIOUS.',
  'STILL TRACKING.',
  'TARGET CONFIRMED. PROCEED.',
  'POSSIBLE HIRING MANAGER. STAY SHARP.',
  'SUSPECT IS ENGAGED. REPEAT, ENGAGED.',
  'PORTFOLIO INTRUSION DETECTED. NOMINAL.',
  'TEN-FOUR. ON IT.',
];

function AgentSurveillance() {
  const [active, setActive] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down');
  const [bubbleL, setBubbleL] = useState<string | null>(null);
  const [bubbleR, setBubbleR] = useState<string | null>(null);
  const [reticle, setReticle] = useState<{ x: number; y: number } | null>(null);
  const [idleFrame, setIdleFrame] = useState(0);
  // Peek states — agents mostly hide off-screen and occasionally lean out.
  const [peekL, setPeekL] = useState(false);
  const [peekR, setPeekR] = useState(false);
  const lastY = useRef(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnIndex = useRef(0);

  // Activate when the visitor reaches the About section, deactivate at the footer.
  // rAF-throttled so we don't queue React commits on every wheel tick.
  useEffect(() => {
    let rafScheduled = false;
    let lastDir: 'down' | 'up' | null = null;
    const compute = () => {
      rafScheduled = false;
      const aboutEl = document.getElementById('about');
      const aboutTop = aboutEl ? aboutEl.offsetTop : 600;
      const y = window.scrollY;
      setActive(y > aboutTop - 240);
      const dy = y - lastY.current;
      if (dy > 1 && lastDir !== 'down') {
        lastDir = 'down';
        setScrollDir('down');
      } else if (dy < -1 && lastDir !== 'up') {
        lastDir = 'up';
        setScrollDir('up');
      }
      lastY.current = y;
      setScrolling(true);
      if (stopTimer.current) clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => setScrolling(false), 220);
    };
    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(compute);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Speech bubbles — alternate left/right agent so it reads like radio chatter.
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const next = () => {
      if (cancelled) return;
      const isLeft = turnIndex.current % 2 === 0;
      if (isLeft) {
        const line = SUSPECT_LINES_A[Math.floor(Math.random() * SUSPECT_LINES_A.length)];
        setBubbleL(line);
        setBubbleR(null);
      } else {
        const line = SUSPECT_LINES_B[Math.floor(Math.random() * SUSPECT_LINES_B.length)];
        setBubbleR(line);
        setBubbleL(null);
      }
      turnIndex.current += 1;
    };
    next();
    const id = setInterval(next, 4400);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [active]);

  // Random peek cycle — every 5-8s an agent leans out for 2-3s, then retreats.
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const cycle = () => {
      if (cancelled) return;
      const side = Math.random() < 0.5 ? 'L' : 'R';
      const duration = 1900 + Math.random() * 1400;
      if (side === 'L') {
        setPeekL(true);
        window.setTimeout(() => setPeekL(false), duration);
      } else {
        setPeekR(true);
        window.setTimeout(() => setPeekR(false), duration);
      }
    };
    // A delayed first peek so it doesn't fire the instant the section appears.
    const first = window.setTimeout(cycle, 1800);
    const id = setInterval(cycle, 5400);
    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(id);
    };
  }, [active]);

  // Periodic targeting reticle — drops on a random spot of the viewport.
  useEffect(() => {
    if (!active) return;
    const drop = () => {
      const x = 22 + Math.random() * 56; // 22-78% horizontal
      const y = 28 + Math.random() * 48; // 28-76% vertical
      setReticle({ x, y });
      window.setTimeout(() => setReticle(null), 1500);
    };
    const id = setInterval(drop, 9500);
    // First drop a moment after activation
    const first = window.setTimeout(drop, 3000);
    return () => {
      clearInterval(id);
      clearTimeout(first);
    };
  }, [active]);

  // Idle blink frames (only when not actively scrolling)
  useEffect(() => {
    if (scrolling) return;
    const id = setInterval(() => setIdleFrame((f) => (f + 1) % 3), 1700);
    return () => clearInterval(id);
  }, [scrolling]);

  // While scrolling, lock the gleam to the scroll direction so the eyes
  // "track" the visitor. While idle, cycle through the gleam frames.
  const frameL = scrolling ? (scrollDir === 'down' ? 1 : 2) : idleFrame;
  const frameR = scrolling ? (scrollDir === 'down' ? 2 : 1) : (idleFrame + 1) % 3;

  const classesL = [
    'agent-fixed',
    'left',
    active && 'is-active',
    peekL && 'is-peeking',
    bubbleL && 'is-speaking',
  ]
    .filter(Boolean)
    .join(' ');
  const classesR = [
    'agent-fixed',
    'right',
    active && 'is-active',
    peekR && 'is-peeking',
    bubbleR && 'is-speaking',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={classesL} aria-hidden="true">
        {bubbleL && (
          <div className="agent-bubble left">
            <span className="bubble-id">▸ AGENT-A · CH 12</span>
            <span className="bubble-line">{bubbleL}</span>
          </div>
        )}
        <span className="agent-fixed-glow" />
        <FbiAgent scale={3} frame={frameL} />
        <span className="earpiece-blink fixed" />
      </div>

      <div className={classesR} aria-hidden="true">
        {bubbleR && (
          <div className="agent-bubble right">
            <span className="bubble-id">▸ AGENT-B · CH 12</span>
            <span className="bubble-line">{bubbleR}</span>
          </div>
        )}
        <span className="agent-fixed-glow" />
        <FbiAgent scale={3} frame={frameR} flipped />
        <span className="earpiece-blink fixed" />
      </div>

      {active && reticle && (
        <div
          className="surveillance-reticle"
          style={{ left: `${reticle.x}%`, top: `${reticle.y}%` }}
          aria-hidden="true"
        >
          <span className="reticle-corner tl" />
          <span className="reticle-corner tr" />
          <span className="reticle-corner bl" />
          <span className="reticle-corner br" />
          <span className="reticle-crosshair v" />
          <span className="reticle-crosshair h" />
          <span className="reticle-id">ACQUIRING TARGET...</span>
        </div>
      )}
    </>
  );
}

/* =========================================================================
   App shell — composes the whole NYC scene
   ========================================================================= */
export default function NycApp() {
  const [active, setActive] = useState<SectionId>('hero');
  const [theme, setTheme] = useState<Theme>('night');
  const [hintHidden, setHintHidden] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Read persisted state on mount (avoids SSR mismatch — initial render is always `day` + hint visible)
  useEffect(() => {
    setHydrated(true);
    try {
      const t = localStorage.getItem('nyc-theme');
      if (t === 'day' || t === 'night') setTheme(t);
      if (localStorage.getItem('nyc-hint-seen') === '1') setHintHidden(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('nyc-theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme, hydrated]);

  const toggleTheme = () => setTheme((t) => (t === 'day' ? 'night' : 'day'));

  // Keyboard shortcut: N toggles day/night
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName || '')) return;
      if (e.key === 'n' || e.key === 'N') {
        toggleTheme();
        setHintHidden(true);
        try {
          localStorage.setItem('nyc-hint-seen', '1');
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onNav = (id: SectionId) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
  };

  // Scroll-spy: IntersectionObserver picks the section whose top crosses an
  // upper-mid band of the viewport. Way cheaper than a per-scroll loop and
  // doesn't fire setState on every wheel tick — what was making the navbar
  // highlight feel laggy before.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id as SectionId);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <NavBar active={active} onNav={onNav} theme={theme} toggleTheme={toggleTheme} />
      <NavDots active={active} onNav={onNav} />
      <NowArriving active={active} />

      <main data-screen-label="Michal Borek · portfolio">
        <HeroSection onNav={onNav} theme={theme} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ResearchSection />
        <ResumeSection />
        <ContactSection />
      </main>

      <FooterSection />

      <StreetStrip />
      <Walker />
      <AgentSurveillance />

      <div className="manhole-vent" style={{ left: '22%' }}>
        <Manhole scale={2.5} />
        <span className="puff" />
        <span className="puff" />
        <span className="puff" />
      </div>
      <div className="manhole-vent" style={{ left: '64%' }}>
        <Manhole scale={2} />
        <span className="puff" />
        <span className="puff" />
      </div>

      <div className={`kbd-hint ${hintHidden ? 'hidden' : ''}`}>
        press <span className="kbd">N</span> for {theme === 'day' ? 'night' : 'day'} mode
      </div>
    </>
  );
}
