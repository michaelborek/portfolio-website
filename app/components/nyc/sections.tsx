'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { getAssetPath } from '../../utils/basePath';
import {
  AiChip,
  Bench,
  Blimp,
  BrickBuilding,
  Building,
  Cloud,
  CorpBuilding,
  Diner,
  Diploma,
  Drone,
  Envelope,
  GradCap,
  Helicopter,
  HotAirBalloon,
  Hydrant,
  Icons,
  Mailbox,
  Medal,
  Moon,
  NewsStand,
  PaperPlane,
  Pigeon,
  Plane,
  Robot,
  Satellite,
  StarField,
  StoneBuilding,
  SubwaySign,
  Sun,
  TrashCan,
  Ufo,
} from './sprites';

/* Brand presets for the corporate skyline.
   Each becomes a pixel-art tower with brand-color neon marquee, side sign,
   ground halo, and a rooftop variant (set per-instance below). */
const CORP = {
  google:    { name: 'GOOGLE',    brand: '#4285F4', textColor: '#FFFFFF', facade: '#C8CDD5' },
  apple:     { name: 'APPLE',     brand: '#1D1D1F', textColor: '#F0EAD8', facade: '#9CA3B0' },
  openai:    { name: 'OPENAI',    brand: '#10A37F', textColor: '#FFFFFF', facade: '#2E3445' },
  anthropic: { name: 'ANTHROPIC', brand: '#D97757', textColor: '#1A1F2E', facade: '#F0E0CB' },
  nvidia:    { name: 'NVIDIA',    brand: '#76B900', textColor: '#0A0E1A', facade: '#1A1F2E' },
  meta:      { name: 'META',      brand: '#0866FF', textColor: '#FFFFFF', facade: '#2E3445' },
  tesla:     { name: 'TESLA',     brand: '#E31937', textColor: '#FFFFFF', facade: '#1A1F2E' },
  msft:      { name: 'MSFT',      brand: '#00A4EF', textColor: '#FFFFFF', facade: '#5C6173' },
  xai:       { name: 'xAI',       brand: '#A5A5B0', textColor: '#0A0E1A', facade: '#1A1F2E' },
} as const;

/* =========================================================================
   HERO
   ========================================================================= */
export function HeroSection({
  onNav,
  theme = 'day',
}: {
  onNav: (id: 'projects' | 'contact') => void;
  theme?: 'day' | 'night';
}) {
  const isNight = theme === 'night';
  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      {isNight && <StarField count={80} seed={42} />}

      <div className="celestial">{isNight ? <Moon scale={4} /> : <Sun scale={5} />}</div>

      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          height: 220,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
          opacity: isNight ? 0.35 : 1,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '-15vw' }} className="cloud-drift">
          <Cloud scale={3} />
        </div>
        <div
          style={{ position: 'absolute', top: 80, left: '-15vw', animationDelay: '-22s' }}
          className="cloud-drift"
        >
          <Cloud scale={4} />
        </div>
        <div
          style={{ position: 'absolute', top: 180, left: '-15vw', animationDelay: '-44s' }}
          className="cloud-drift"
        >
          <Cloud scale={2.5} />
        </div>
        <div
          style={{ position: 'absolute', top: 40, left: '-15vw', animationDelay: '-12s' }}
          className="cloud-drift"
        >
          <Cloud scale={2.2} />
        </div>
      </div>

      <div className="flying-bird" style={{ top: 150, left: '-40px' }}>
        <span className="pigeon-flap">
          <Pigeon frame={0} scale={2} />
        </span>
      </div>

      <div className="plane-drift" style={{ top: 60, left: 0, animationDuration: '42s' }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span className="plane-contrail" />
          <Plane scale={2} />
        </span>
      </div>

      <div className="blimp-drift" style={{ top: 200, left: 0, animationDelay: '-30s' }}>
        <Blimp scale={2.4} />
        <span className="banner">HIRE MICHAL · SPRING &rsquo;26</span>
      </div>

      <div
        className="plane-drift"
        style={{
          top: 120,
          left: 0,
          animationDelay: '-18s',
          animationDuration: '58s',
          opacity: 0.85,
        }}
      >
        <Plane scale={1.4} />
      </div>

      {/* Pixel skyline (back) */}
      <div className="skyline far">
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            gap: 8,
            paddingLeft: 0,
            alignItems: 'flex-end',
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const w = 80 + ((i * 17) % 60);
            const h = 90 + ((i * 41) % 110);
            const color = isNight ? '#2A3043' : '#9CA3B0';
            return (
              <Building
                key={i}
                width={w}
                height={h}
                color={color}
                windowColor="#FCD34D"
                cols={3}
                rows={Math.max(3, Math.floor(h / 30))}
                blinkEvery={isNight ? 3 : 6}
              />
            );
          })}
        </div>
      </div>

      <div className="skyline mid">
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            gap: 4,
            alignItems: 'flex-end',
          }}
        >
          <BrickBuilding width={120} height={200} />
          <StoneBuilding width={150} height={260} />
          <BrickBuilding width={110} height={180} cols={3} rows={5} />
          <StoneBuilding width={140} height={240} />
          <BrickBuilding width={130} height={220} />
          <StoneBuilding width={120} height={200} />
          <BrickBuilding width={140} height={240} cols={4} rows={7} />
          <StoneBuilding width={120} height={210} />
          <BrickBuilding width={140} height={250} cols={4} rows={7} />
        </div>
      </div>

      <div className="container hero-grid">
        <div>
          <div className="name-card">
            <span className="dot" />
            <span className="mono">OPEN TO WORK · ANY US STATE · REMOTE</span>
          </div>

          <h1>
            Hey, I&rsquo;m <span className="accent">Michal.</span>
            <br />I ship <span className="hl-marker">real ML systems</span>.
          </h1>

          <p className="lede">
            Machine Learning Engineer &amp; AI Consultant — finishing my B.S. in Computational Data
            Science at Michigan State (Spring &rsquo;26). I build end-to-end AI systems: RAG
            pipelines, computer vision models, and production deployments that solve real problems.
          </p>

          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => onNav('projects')}>
              See my work →
            </button>
            <button className="btn btn-secondary" onClick={() => onNav('contact')}>
              Get in touch
            </button>
            <a
              className="btn btn-secondary"
              href="https://github.com/michaelborek"
              target="_blank"
              rel="noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
              </svg>
              GitHub
            </a>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="v">
                4 <span className="small">shipped</span>
              </div>
              <div className="k">production projects</div>
            </div>
            <div className="stat">
              <div className="v">
                1 <span className="small">SPIE</span>
              </div>
              <div className="k">published paper · 2025</div>
            </div>
            <div className="stat">
              <div className="v">
                92<span className="small">%</span>
              </div>
              <div className="k">DarkVision accuracy</div>
            </div>
          </div>
        </div>

        <div className="hero-portrait">
          <div
            style={{
              background: 'var(--nyc-paper-2)',
              border: '4px solid var(--ink)',
              boxShadow: '8px 8px 0 0 var(--ink)',
              padding: 16,
              transform: 'rotate(-1.5deg)',
              position: 'relative',
              zIndex: 4,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getAssetPath('/pixel_me.png')}
              alt="Michal Borek — pixel portrait"
              width={260}
              height={260}
              style={{ display: 'block', width: 260, height: 260, imageRendering: 'pixelated' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                fontFamily: "'Geist Mono', monospace",
                fontSize: 11,
                color: 'var(--ink-3)',
              }}
            >
              <span>./pixel_me.png</span>
              <span>
                <span style={{ color: '#2D8954' }}>●</span> pixel
              </span>
            </div>
          </div>

          <div style={{ position: 'absolute', top: 4, left: -6, zIndex: 5, transform: 'rotate(-6deg)' }}>
            <SubwaySign letter="M" size={56} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   ABOUT — Classified case file
   ========================================================================= */
export function AboutSection() {
  const [robotFrame, setRobotFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRobotFrame((f) => (f + 1) % 2), 280);
    return () => clearInterval(id);
  }, []);
  return (
    <section
      id="about"
      className="section"
      data-screen-label="02 About"
      style={{ background: 'var(--bg-section)' }}
    >
      {/* Corporate skyline — scattered along the street, neon-lit */}
      {/* Left gutter — 3 towers stacked along the street */}
      <div className="corp-street" style={{ left: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.google} floors={12} scale={5} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ left: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.nvidia} floors={7} scale={3.5} rooftop="billboard" />
      </div>
      <div className="corp-street" style={{ left: 'max(140px, calc(50% - 635px))', opacity: 0.85 }}>
        <CorpBuilding {...CORP.meta} floors={9} scale={3} rooftop="water-tower" />
      </div>
      {/* Right gutter — 3 towers stacked along the street */}
      <div className="corp-street" style={{ right: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.anthropic} floors={13} scale={5} rooftop="helipad" />
      </div>
      <div className="corp-street" style={{ right: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.openai} floors={8} scale={3.5} rooftop="dome" />
      </div>
      <div className="corp-street" style={{ right: 'max(140px, calc(50% - 635px))', opacity: 0.85 }}>
        <CorpBuilding {...CORP.tesla} floors={6} scale={3} rooftop="antenna" />
      </div>
      {/* Ground-level: hydrant on left, full diner on right */}
      <div className="section-deco" style={{ bottom: 4, left: 24 }}>
        <Hydrant scale={3} />
      </div>
      <div className="section-deco" style={{ bottom: 0, right: 40 }}>
        <Diner scale={3} />
      </div>
      <div className="balloon-rise" style={{ right: '4%', animationDelay: '-12s' }}>
        <HotAirBalloon scale={2} />
      </div>

      {/* ============== Side margin life: UFO, drone, packets, robot ============== */}
      <div className="ufo-drift" style={{ top: 180 }}>
        <span className="ufo-beam" />
        <Ufo scale={2.2} />
      </div>
      <div className="drone-drift" style={{ top: 340 }}>
        <span className="drone-rotor a" />
        <span className="drone-rotor b" />
        <Drone scale={2} />
      </div>
      <div className="flying-bird" style={{ top: 90, left: '-40px', animationDuration: '28s' }}>
        <span className="pigeon-flap">
          <Pigeon frame={0} scale={2} />
        </span>
      </div>
      <div
        className="flying-bird"
        style={{ top: 240, left: '-40px', animationDelay: '-12s', animationDuration: '32s' }}
      >
        <span className="pigeon-flap">
          <Pigeon frame={0} scale={1.6} />
        </span>
      </div>

      <span className="data-packet" style={{ top: 220, animationDelay: '-2s' }}>
        0x4A · token
      </span>
      <span className="data-packet" style={{ top: 380, animationDelay: '-9s' }}>
        &lt;RAG/&gt;
      </span>
      <span className="data-packet" style={{ top: 540, animationDelay: '-5s' }}>
        AI · 1011
      </span>
      <span className="data-packet alt" style={{ top: 470, animationDelay: '-1s' }}>
        embed · 768d
      </span>
      <span className="data-packet alt" style={{ top: 620, animationDelay: '-7s' }}>
        loss=0.012
      </span>

      {/* Pixel robot pacing on a side ledge */}
      <div className="robot-ledge left">
        <span className="ledge-bar" />
        <span className="robot-pace">
          <Robot frame={robotFrame} scale={2.2} />
        </span>
      </div>
      <div className="robot-ledge right">
        <span className="ledge-bar" />
        <span className="robot-pace reverse">
          <Robot frame={(robotFrame + 1) % 2} scale={2.2} />
        </span>
      </div>

      <div className="container container-about">
        <div className="section-eyebrow">
          <span className="sign pixel-sign">DOSSIER 02</span>
          <span className="label">About me · AI/ML CORE</span>
        </div>
        <h2 className="section-title">
          The <span className="accent">short version.</span>
        </h2>
        <p className="section-sub">
          Five years deep into Python, two years into production ML, halfway through a CS+Math
          degree — and the same coffee order at the same MSU café for three years running.
        </p>

        <div className="about-wrap">
          <div className="ai-terminal">
            {/* Terminal title bar with traffic-light LEDs */}
            <div className="term-chrome">
              <span className="term-led red" />
              <span className="term-led yellow" />
              <span className="term-led green" />
              <span className="term-title">
                NEURAL.DOSSIER · 02-MB-2026.bin
              </span>
              <span className="term-status">
                <span className="term-pulse" /> ONLINE
              </span>
            </div>

            {/* AI/ML CORE pixel badge (replaces TOP SECRET stamp) */}
            <div className="ai-badge">
              <span className="ai-badge-tick">▶</span>
              AI/ML CORE
              <span className="ai-badge-check">✓</span>
            </div>

            {/* Small neural chip in the corner */}
            <div className="term-chip" aria-hidden="true">
              <AiChip scale={2} />
            </div>

            <span className="term-scan" />

            <div className="term-body">
              <div className="term-prompt">
                <span className="prompt-arrow">▸</span>
                <span className="prompt-cmd">cat dossier.json | parse --subject &quot;M.BOREK&quot;</span>
              </div>

              <div className="term-meta">
                <span>
                  FILE <span className="id">02-MB-2026</span>
                </span>
                <span>SUBJECT · M. BOREK</span>
                <span>CLEARANCE · OPEN TO WORK</span>
              </div>

              <p style={{ fontSize: 18, lineHeight: 1.7, margin: 0 }}>
                I&rsquo;m a Machine Learning Engineer graduating from{' '}
                <strong>Michigan State University</strong> with a degree in Computational Data Science
                and a Mathematics minor. I specialize in building end-to-end AI systems — from data
                pipelines and model training to production deployment.
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.7, margin: '14px 0 0' }}>
                Recent ops include a full RAG system for legal document research with citation
                verification, medical-imaging classifiers{' '}
                <a
                  href="https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13407/134072Q/Ordinal-classification-framework-for-multiclass-grading-of-pneumoconiosis/10.1117/12.3046353.short"
                  target="_blank"
                  rel="noreferrer"
                >
                  published at SPIE 2025
                </a>
                , and Agentic-AI tooling for high-performance computing.
              </p>

              <span className="pixel-divider" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div className="label-mono" style={{ marginBottom: 6 }}>
                    ★ EDUCATION
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                    B.S. Computational Data Science
                  </div>
                  <div style={{ fontSize: 15, opacity: 0.85 }}>
                    + Mathematics minor · MSU · Spring 2026
                  </div>
                </div>
                <div>
                  <div className="label-mono" style={{ marginBottom: 6 }}>
                    ● OPEN TO (anywhere in the US)
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.5 }}>
                    MLE / AI Engineer full-time · ML consulting · Applied-AI research collaborations
                  </div>
                </div>
              </div>

              <span className="pixel-divider" />

              <div className="label-mono" style={{ marginBottom: 10 }}>
                FIELD HISTORY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="term-row">
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>Software Engineer Intern</span>
                    <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 10 }}>
                      · iCER (Institute for Cyber-Enabled Research)
                    </span>
                  </div>
                  <span className="mono">2025</span>
                </div>
                <div className="term-row">
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>Research Assistant</span>
                    <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 10 }}>
                      · MIDI Lab — medical imaging
                    </span>
                  </div>
                  <span className="mono">2024 — 2025</span>
                </div>
                <div className="term-row last">
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>Published Researcher</span>
                    <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 10 }}>
                      · SPIE Medical Imaging 2025
                    </span>
                  </div>
                  <span className="mono">Apr 2025</span>
                </div>
              </div>

              <div className="term-cursor-line">
                <span className="prompt-arrow">▸</span>
                <span className="prompt-cmd">end of dossier</span>
                <span className="term-cursor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SKILLS
   ========================================================================= */
type SkillIcon = keyof typeof Icons;
type SkillGroup = {
  cat: string;
  badge: string;
  items: { name: string; icon: SkillIcon; level: number }[];
};
const SKILL_GROUPS: SkillGroup[] = [
  {
    cat: 'Languages',
    badge: 'L · 4',
    items: [
      { name: 'Python', icon: 'python', level: 95 },
      { name: 'SQL', icon: 'sql', level: 90 },
      { name: 'TypeScript', icon: 'ts', level: 80 },
      { name: 'C++', icon: 'cpp', level: 75 },
    ],
  },
  {
    cat: 'ML & AI',
    badge: 'A · 5',
    items: [
      { name: 'PyTorch', icon: 'pytorch', level: 90 },
      { name: 'RAG / LLMs', icon: 'rag', level: 90 },
      { name: 'Pandas / NumPy', icon: 'pandas', level: 95 },
      { name: 'Computer Vision', icon: 'cv', level: 88 },
      { name: 'TensorFlow', icon: 'tensorflow', level: 75 },
    ],
  },
  {
    cat: 'Infrastructure',
    badge: 'F · 6',
    items: [
      { name: 'FastAPI', icon: 'fastapi', level: 90 },
      { name: 'Docker', icon: 'docker', level: 85 },
      { name: 'PostgreSQL', icon: 'postgres', level: 85 },
      { name: 'Qdrant', icon: 'qdrant', level: 85 },
      { name: 'Next.js', icon: 'nextjs', level: 80 },
      { name: 'React', icon: 'react', level: 78 },
    ],
  },
];

export function SkillsSection() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAnimated(true);
          obs.disconnect();
        }
      },
      { rootMargin: '0px 0px -120px 0px' },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="skills"
      className="section"
      data-screen-label="03 Skills"
      ref={ref}
      style={{ background: 'var(--bg-section-alt)' }}
    >
      {/* Corporate skyline — scattered along the street */}
      <div className="corp-street" style={{ left: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.apple} floors={14} scale={5} rooftop="dome" />
      </div>
      <div className="corp-street" style={{ left: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.msft} floors={8} scale={3.5} rooftop="water-tower" />
      </div>
      <div className="corp-street" style={{ left: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.xai} floors={6} scale={3} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ right: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.google} floors={11} scale={5} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ right: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.nvidia} floors={9} scale={3.5} rooftop="billboard" />
      </div>
      <div className="corp-street" style={{ right: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.meta} floors={7} scale={3} rooftop="helipad" />
      </div>
      {/* Ground-level: news stand on left, bench + trashcan on right */}
      <div className="section-deco" style={{ bottom: 0, left: 40 }}>
        <NewsStand scale={3} />
      </div>
      <div className="section-deco" style={{ bottom: 0, right: 140, opacity: 0.9 }}>
        <Bench scale={2.4} />
      </div>
      <div className="section-deco" style={{ bottom: 0, right: 40, opacity: 0.85 }}>
        <TrashCan scale={2.4} />
      </div>
      <div className="chopper-hover" style={{ top: 90, left: 0, animationDelay: '-4s, -8s' }}>
        <Helicopter scale={2} />
      </div>

      {/* Sky life — UFO, drone, pigeons */}
      <div className="ufo-drift" style={{ top: 160, animationDuration: '52s' }}>
        <span className="ufo-beam" />
        <Ufo scale={2} />
      </div>
      <div className="drone-drift" style={{ top: 280, animationDuration: '28s' }}>
        <span className="drone-rotor a" />
        <span className="drone-rotor b" />
        <Drone scale={1.8} />
      </div>
      <div className="flying-bird" style={{ top: 120, left: '-40px', animationDuration: '24s' }}>
        <span className="pigeon-flap"><Pigeon frame={0} scale={1.8} /></span>
      </div>
      <div className="flying-bird" style={{ top: 220, left: '-40px', animationDelay: '-9s', animationDuration: '30s' }}>
        <span className="pigeon-flap"><Pigeon frame={0} scale={2.2} /></span>
      </div>

      {/* Floating dev data packets */}
      <span className="data-packet" style={{ top: 200, animationDelay: '-3s' }}>Python · 95%</span>
      <span className="data-packet" style={{ top: 340, animationDelay: '-7s' }}>0x4F · vector</span>
      <span className="data-packet alt" style={{ top: 470, animationDelay: '-1s' }}>&lt;RAG/&gt;</span>
      <span className="data-packet" style={{ top: 580, animationDelay: '-5s' }}>git push origin</span>
      <span className="data-packet alt" style={{ top: 660, animationDelay: '-11s' }}>fastapi: 200 OK</span>

      {/* Compile-progress badge — pulsing "RUN" indicator in the corner */}
      <div className="compile-badge" aria-hidden="true">
        <span className="compile-led" />
        <span className="compile-text">▶ RUN · build #4221</span>
        <span className="compile-bar"><span /></span>
      </div>

      <div className="container">
        <div className="section-eyebrow">
          <span className="sign pixel-sign">BLOCK 03</span>
          <span className="label">The toolbelt</span>
        </div>
        <h2 className="section-title">
          Skills, <span className="accent">honestly rated.</span>
        </h2>
        <p className="section-sub">
          Self-graded. The honest ones — not the ones inflated for keyword scanners. I&rsquo;ve
          actually shipped with everything here.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {SKILL_GROUPS.map((g, gi) => (
            <div key={g.cat} className="skill-category-card">
              <div className="cat-head">
                <h3>{g.cat}</h3>
                <span className="badge">{g.badge}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {g.items.map((s, si) => (
                  <div key={s.name} className="skill-row">
                    <span className="icon">{Icons[s.icon]}</span>
                    <span className="name">{s.name}</span>
                    <span className="level">
                      <span className="bar">
                        <div
                          style={{
                            width: animated ? `${s.level}%` : 0,
                            transition: `width 800ms ${gi * 200 + si * 90 + 200}ms cubic-bezier(.2,.8,.2,1)`,
                          }}
                        />
                      </span>
                      <span className="pct">{s.level}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PROJECTS
   ========================================================================= */
type ProjectArt = {
  tone: 'red' | 'green' | 'blue' | 'purple' | 'amber';
  headline: string;
  sub: string;
  glyph: string;
  metric?: { label: string; value: string };
};
type Project = {
  title: string;
  tag: string;
  desc: string;
  art: ProjectArt;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
};
const PROJECTS: Project[] = [
  {
    title: 'Legal AI — RAG Research Assistant',
    tag: 'FLAGSHIP · 2025',
    desc:
      'Open-source RAG for legal and tax document research. Hybrid search (PostgreSQL full-text + Qdrant vector) with a local Llama 3.1 (Ollama). Every response passes through a citation-verification layer that rejects unsupported claims — making hallucinations structurally impossible.',
    art: {
      tone: 'red',
      headline: 'RAG → CITED',
      sub: 'every claim verified',
      glyph: '§',
      metric: { label: 'HALLUCINATIONS', value: '0' },
    },
    tags: ['Python', 'FastAPI', 'Next.js', 'RAG', 'Qdrant', 'PostgreSQL', 'Ollama'],
    github: 'https://github.com/michaelborek/Law-Assistant',
    featured: true,
  },
  {
    title: 'DarkVision',
    tag: 'CV',
    desc:
      'Computer-vision model for classifying animals in dark, low-visibility imagery — 92% accuracy with fine-tuned ResNet-18.',
    art: {
      tone: 'blue',
      headline: '92% ACC',
      sub: 'low-light vision',
      glyph: '◉',
      metric: { label: 'BACKBONE', value: 'ResNet-18' },
    },
    tags: ['PyTorch', 'CNN', 'ResNet-18'],
    github: 'https://github.com/michaelborek/DarkVision',
  },
  {
    title: 'Auto Grader',
    tag: 'TOOLING',
    desc:
      'Automated grading system that evaluates student code submissions against test suites — instant feedback and scoring.',
    art: {
      tone: 'green',
      headline: 'A+ · PASS',
      sub: 'unit-test runner',
      glyph: '✓',
      metric: { label: 'FEEDBACK', value: 'instant' },
    },
    tags: ['Python', 'Unittest', 'Linux'],
    github: 'https://github.com/michaelborek/AUTO-GRADER',
  },
  {
    title: 'QSide-Notebook',
    tag: 'DATA-VIZ',
    desc:
      'Browser-based data visualization tool — lets users explore and chart datasets in JupyterLite without local setup.',
    art: {
      tone: 'purple',
      headline: 'PLOT.IO',
      sub: 'jupyterlite in-browser',
      glyph: '▮▯▮',
      metric: { label: 'SETUP', value: '0 ms' },
    },
    tags: ['JupyterLite', 'Python', 'SQL'],
    github: 'https://github.com/michaelborek/QSide-Notebook',
    demo: 'https://malshaik.github.io/QSide-Notebook/',
  },
];

export function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  const Card = ({ p }: { p: Project }) => (
    <article className={`proj-card ${p.featured ? 'featured' : ''}`}>
      <div className={`thumb thumb-pixel tone-${p.art.tone}`}>
        <span className="thumb-grid" aria-hidden="true" />
        <span className="thumb-noise" aria-hidden="true" />
        <span className="thumb-scanline" aria-hidden="true" />
        <span className="thumb-glyph" aria-hidden="true">{p.art.glyph}</span>
        <span className="thumb-headline">{p.art.headline}</span>
        <span className="thumb-sub">{p.art.sub}</span>
        {p.art.metric && (
          <span className="thumb-metric">
            <span className="metric-label">{p.art.metric.label}</span>
            <span className="metric-value">{p.art.metric.value}</span>
          </span>
        )}
        <span className="thumb-status">
          <span className="thumb-status-led" /> DEPLOYED
        </span>
        <span className="pixel-frame">{p.tag}</span>
      </div>
      <div className="body">
        <div className="city-tag">▸ {p.tag.toLowerCase()} block</div>
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="links">
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
              </svg>
              <span>Code on GitHub</span>
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M14 3h7v7M21 3l-9 9M5 5h6M5 5v14h14v-6" />
              </svg>
              <span>Live demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <section
      id="projects"
      className="section"
      data-screen-label="04 Projects"
      style={{ background: 'var(--bg-section)' }}
    >
      {/* Corporate skyline — scattered along the street */}
      <div className="corp-street" style={{ left: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.openai} floors={13} scale={5} rooftop="dome" />
      </div>
      <div className="corp-street" style={{ left: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.meta} floors={9} scale={3.5} rooftop="billboard" />
      </div>
      <div className="corp-street" style={{ left: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.tesla} floors={6} scale={3} rooftop="helipad" />
      </div>
      <div className="corp-street" style={{ right: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.anthropic} floors={11} scale={5} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ right: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.xai} floors={8} scale={3.5} rooftop="water-tower" />
      </div>
      <div className="corp-street" style={{ right: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.apple} floors={6} scale={3} rooftop="dome" />
      </div>
      {/* Ground-level: diner on left, news stand on right */}
      <div className="section-deco" style={{ bottom: 0, left: 30 }}>
        <Diner scale={3} />
      </div>
      <div className="section-deco" style={{ bottom: 0, right: 40 }}>
        <NewsStand scale={3} />
      </div>
      <div className="section-deco" style={{ bottom: 0, left: 220, opacity: 0.8 }}>
        <Hydrant scale={2.4} />
      </div>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const colors = ['#FCD34D', '#C9342B', '#2563EB', '#2D8954', '#62B6CB', '#E89215'];
          const left = (i * 6.3) % 100;
          const dur = 8 + ((i * 7) % 10);
          const delay = -((i * 1.7) % 12);
          return (
            <span
              key={i}
              className="ticker-tape"
              style={{
                left: `${left}%`,
                background: colors[i % colors.length],
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Sky life — UFO, drone, pigeons */}
      <div className="ufo-drift" style={{ top: 130, animationDuration: '44s' }}>
        <span className="ufo-beam" />
        <Ufo scale={2.4} />
      </div>
      <div className="drone-drift" style={{ top: 320, animationDuration: '30s' }}>
        <span className="drone-rotor a" />
        <span className="drone-rotor b" />
        <Drone scale={2} />
      </div>
      <div className="flying-bird" style={{ top: 90, left: '-40px', animationDuration: '26s' }}>
        <span className="pigeon-flap"><Pigeon frame={0} scale={2} /></span>
      </div>
      <div className="flying-bird" style={{ top: 240, left: '-40px', animationDelay: '-13s', animationDuration: '32s' }}>
        <span className="pigeon-flap"><Pigeon frame={0} scale={1.6} /></span>
      </div>

      {/* CI / deploy-style data packets */}
      <span className="data-packet" style={{ top: 180, animationDelay: '-4s' }}>deploy: ✓</span>
      <span className="data-packet alt" style={{ top: 320, animationDelay: '-9s' }}>commit · af3b12c</span>
      <span className="data-packet" style={{ top: 460, animationDelay: '-2s' }}>PR #42 merged</span>
      <span className="data-packet alt" style={{ top: 600, animationDelay: '-6s' }}>build 92.4% cov</span>
      <span className="data-packet" style={{ top: 740, animationDelay: '-11s' }}>docker push :latest</span>

      {/* Scanning sweep — slow horizontal scan line indicates "loading projects" */}
      <span className="scan-sweep" aria-hidden="true" />

      <div className="container">
        <div className="section-eyebrow">
          <span className="sign pixel-sign">BLOCK 04</span>
          <span className="label">Things I built</span>
        </div>
        <h2 className="section-title">
          Work I&rsquo;m <span className="accent">proud of.</span>
        </h2>
        <p className="section-sub">
          End-to-end systems — from data pipelines and model training to production deployment. The
          flagship is Legal AI; the rest are research and tooling I built end-to-end.
        </p>

        <div className="proj-grid">
          {featured && <Card p={featured} />}
          {others.map((p) => (
            <Card key={p.title} p={p} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a
            href="https://github.com/michaelborek"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
            </svg>
            More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   RESEARCH
   ========================================================================= */
type PaperStatus = 'published' | 'under-review' | 'poster';
type Paper = {
  title: string;
  venue: string;
  date: string;
  doi?: string;
  color: 'red' | 'green' | 'blue' | 'amber';
  rune: string;
  summary: string;
  authors: string;
  link?: string;
  status: PaperStatus;
  pages?: string;
};
const PAPERS: Paper[] = [
  {
    title: 'Deep Learning Algorithm for Pneumoconiosis Staging on Chest Radiographs',
    venue: 'UURAF 2025 · MIDI Lab · Michigan State University',
    date: 'Apr 2025',
    color: 'amber',
    rune: '◆',
    summary:
      'First-author UURAF poster comparing six loss functions (cross-entropy, CORN, CORAL, Focal Staging, Hierarchical, Hierarchical CE) on a ResNet pipeline for ordinal pneumoconiosis grading. CORN loss tops out at 70.9% accuracy and 0.838 CSMA on the NIOSH chest-radiograph repository.',
    authors: 'Borek, M., Liu, M., Huang, Z., Loveless, I., Rosenman, K., Alessio, A., Wang, L.',
    link: getAssetPath('/UURAF_poster_2025.pdf'),
    status: 'poster',
  },
  {
    title: 'Ordinal Classification Framework for Multiclass Grading of Pneumoconiosis',
    venue: 'SPIE Medical Imaging 2025 · Computer-Aided Diagnosis',
    date: 'Apr 2025',
    doi: '10.1117/12.3046353',
    color: 'red',
    rune: '✦',
    summary:
      'A novel ordinal classification framework for automated pneumoconiosis severity grading — addresses the inherent ordinal nature of disease-progression stages versus traditional flat multi-class methods.',
    authors: 'Liu, M., Loveless, I., Huang, Z., Borek, M., Rosenman, K., Alessio, A., Wang, L.',
    link: 'https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13407/134072Q/Ordinal-classification-framework-for-multiclass-grading-of-pneumoconiosis/10.1117/12.3046353.short',
    status: 'published',
    pages: '13407 : 134072Q',
  },
  {
    title: 'Pneumoconiosis Multi-task Screening and Classification using Fine-Tuned Deep Learning Models',
    venue: 'Radiology: Artificial Intelligence',
    date: '2025',
    color: 'blue',
    rune: '⟁',
    summary:
      'Fine-tuned deep learning models for multi-task pneumoconiosis screening and grading on chest X-rays. Currently under peer review at Radiology: Artificial Intelligence.',
    authors: 'Wang, L., Liu, M., Huang, Z., Loveless, I., Borek, M., Rosenman, K., Alessio, A.',
    status: 'under-review',
  },
  {
    title: 'HPC Agentic-AI Framework for Batch Job Script Validation',
    venue: 'iCER Mid-SURE 2025 · Michigan State University',
    date: 'Jul 2025',
    color: 'green',
    rune: '∞',
    summary:
      'An Agentic-AI framework that uses HPC-hosted LLMs (CodeLlama family) to inspect HPC batch submission scripts and advise users on errors before submission — cutting wasted compute.',
    authors: 'Borek, M., et al.',
    link: getAssetPath('/icer_midsure_poster.pdf'),
    status: 'poster',
  },
];

/* Author list with M.BOREK highlighted */
function PaperAuthors({ authors }: { authors: string }) {
  const parts = authors.split(/,\s*/);
  return (
    <span className="paper-authors-line">
      {parts.map((a, i) => {
        const isMe = /borek/i.test(a);
        return (
          <span key={i}>
            {isMe ? <strong className="author-self">{a}</strong> : a}
            {i < parts.length - 1 ? ', ' : ''}
          </span>
        );
      })}
    </span>
  );
}

const STATUS_META: Record<PaperStatus, { text: string; tone: string }> = {
  'published':    { text: 'PUBLISHED',   tone: 'green' },
  'under-review': { text: 'UNDER REVIEW',tone: 'amber' },
  'poster':       { text: 'POSTER · DEMO', tone: 'blue' },
};

export function ResearchSection() {
  return (
    <section
      id="research"
      className="section"
      data-screen-label="05 Research"
      style={{ background: 'var(--bg-section-alt)' }}
    >
      {/* Corporate skyline — scattered along the street */}
      <div className="corp-street" style={{ left: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.anthropic} floors={12} scale={5} rooftop="helipad" />
      </div>
      <div className="corp-street" style={{ left: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.nvidia} floors={8} scale={3.5} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ left: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.msft} floors={6} scale={3} rooftop="dome" />
      </div>
      <div className="corp-street" style={{ right: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.apple} floors={13} scale={5} rooftop="dome" />
      </div>
      <div className="corp-street" style={{ right: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.openai} floors={9} scale={3.5} rooftop="water-tower" />
      </div>
      <div className="corp-street" style={{ right: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.tesla} floors={7} scale={3} rooftop="billboard" />
      </div>
      {/* Ground-level: mailbox + bench on left, news stand on right */}
      <div className="section-deco" style={{ bottom: 0, left: 24 }}>
        <Mailbox scale={2.4} />
      </div>
      <div className="section-deco" style={{ bottom: 0, left: 90, opacity: 0.9 }}>
        <Bench scale={2.2} />
      </div>
      <div className="section-deco" style={{ bottom: 0, right: 40 }}>
        <NewsStand scale={3} />
      </div>
      <div className="satellite-orbit" style={{ top: 60, left: 0, animationDuration: '52s' }}>
        <Satellite scale={2} />
      </div>
      <div className="satellite-orbit" style={{ top: 220, left: 0, animationDuration: '74s', animationDelay: '-22s' }}>
        <Satellite scale={1.6} />
      </div>

      {/* Paper plane towing a manuscript banner — like the hero blimp */}
      <div className="paperplane-drift" style={{ top: 110 }}>
        <PaperPlane scale={2.2} />
        <span className="paperplane-banner">MANUSCRIPT · v3.1 · PEER-REVIEWED</span>
      </div>
      <div className="paperplane-drift" style={{ top: 310, animationDelay: '-26s', animationDuration: '60s' }}>
        <PaperPlane scale={1.6} />
      </div>

      {/* Drone overhead */}
      <div className="drone-drift" style={{ top: 200, animationDuration: '36s', animationDelay: '-8s' }}>
        <span className="drone-rotor a" />
        <span className="drone-rotor b" />
        <Drone scale={1.8} />
      </div>

      {/* Floating math symbols — the research aesthetic */}
      <span className="math-float" style={{ left: '6%',  animationDelay: '-2s'  }}>∫</span>
      <span className="math-float" style={{ left: '14%', animationDelay: '-7s'  }}>Σ</span>
      <span className="math-float" style={{ left: '88%', animationDelay: '-3s'  }}>π</span>
      <span className="math-float" style={{ left: '92%', animationDelay: '-9s'  }}>∇</span>
      <span className="math-float" style={{ left: '4%',  animationDelay: '-11s' }}>∂</span>
      <span className="math-float" style={{ left: '90%', animationDelay: '-14s' }}>λ</span>
      <span className="math-float" style={{ left: '8%',  animationDelay: '-17s' }}>α</span>
      <span className="math-float" style={{ left: '86%', animationDelay: '-20s' }}>∞</span>

      {/* Research-themed data packets */}
      <span className="data-packet" style={{ top: 240, animationDelay: '-3s' }}>arxiv · 2503.04129</span>
      <span className="data-packet alt" style={{ top: 380, animationDelay: '-8s' }}>citations: +14</span>
      <span className="data-packet" style={{ top: 520, animationDelay: '-12s' }}>doi · 10.1117/12.3046353</span>

      <div className="container container-research">
        <div className="section-eyebrow">
          <span className="sign pixel-sign">BLOCK 05</span>
          <span className="label">The archive · TRANSMITTING</span>
        </div>
        <h2 className="section-title">
          Published <span className="accent">research.</span>
        </h2>
        <p className="section-sub">
          First-author posters, a peer-reviewed SPIE publication, and a{' '}
          <em>Radiology: Artificial Intelligence</em> manuscript currently in review — work from
          MSU&rsquo;s MIDI Lab and iCER.
        </p>

        <div className="paper-stack">
          {PAPERS.map((p) => {
            const s = STATUS_META[p.status];
            return (
              <article className={`paper-card paper-${p.color}`} key={p.title}>
                {/* Brand-color top stripe */}
                <span className="paper-stripe" aria-hidden="true" />
                {/* Scanline */}
                <span className="paper-scan" aria-hidden="true" />

                {/* LEFT — pixel-art journal */}
                <div className={`paper-journal ${p.color}`} aria-hidden="true">
                  <span className="journal-spine" />
                  <span className="journal-led" />
                  <span className="journal-rune">{p.rune}</span>
                  <span className="journal-date">{p.date}</span>
                  <span className="journal-binding" />
                </div>

                {/* MIDDLE — content */}
                <div className="paper-body">
                  <div className="paper-status-row">
                    <span className={`paper-status tone-${s.tone}`}>
                      <span className="status-led" />
                      {s.text}
                    </span>
                    <span className="paper-venue">{p.venue}</span>
                  </div>

                  <h3 className="paper-title">{p.title}</h3>

                  <div className="paper-authors">
                    <span className="paper-authors-label">authors</span>
                    <PaperAuthors authors={p.authors} />
                  </div>

                  <p className="paper-summary">{p.summary}</p>

                  <div className="paper-metrics">
                    {p.doi && (
                      <span className="metric metric-doi">
                        <span className="metric-label">DOI</span>
                        <span className="metric-value">{p.doi}</span>
                      </span>
                    )}
                    {p.pages && (
                      <span className="metric">
                        <span className="metric-label">REF</span>
                        <span className="metric-value">{p.pages}</span>
                      </span>
                    )}
                    <span className="metric">
                      <span className="metric-label">DATE</span>
                      <span className="metric-value">{p.date}</span>
                    </span>
                  </div>
                </div>

                {/* RIGHT — action button */}
                <div className="paper-action">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-read"
                    >
                      <span className="btn-prompt">▸</span>
                      <span className="btn-cmd">
                        {p.status === 'poster' ? 'POSTER.pdf' : 'READ.exe'}
                      </span>
                      <span className="btn-arrow">→</span>
                    </a>
                  ) : (
                    <div className="btn-read disabled" aria-disabled="true">
                      <span className="btn-prompt">▸</span>
                      <span className="btn-cmd">
                        {p.status === 'under-review' ? 'AWAIT.review' : 'PAPER.pdf'}
                      </span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   RESUME / COMMENCEMENT — Block 06. Pixel-art diploma card with MSU
   credentials, awards, leadership, and a big download button. Confetti
   rains down from above (animated CSS pixel squares).
   ========================================================================= */
const AWARDS: { label: string; year: string; tone: 'gold' | 'silver' | 'green' }[] = [
  { label: "Dean's List", year: '7 / 8 terms', tone: 'gold' },
  { label: 'REHS Excellent Teamwork', year: '2025', tone: 'silver' },
  { label: 'EGRID Silver Scholarship', year: '2024', tone: 'silver' },
  { label: 'International Tuition Grant', year: '2022', tone: 'green' },
];

const CONFETTI_COLORS = ['#FCD34D', '#C9342B', '#2563EB', '#2D8954', '#62B6CB', '#E89215', '#7C5CC0'];

export function ResumeSection() {
  // Stable confetti pieces — random positions decided once on mount.
  const [confetti, setConfetti] = useState<Array<{
    left: number;
    delay: number;
    dur: number;
    rot: number;
    color: string;
    w: number;
    h: number;
  }>>([]);
  useEffect(() => {
    const pieces = Array.from({ length: 36 }).map(() => ({
      left: Math.random() * 100,
      delay: -Math.random() * 6,
      dur: 4 + Math.random() * 5,
      rot: Math.random() * 360,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      w: 4 + Math.floor(Math.random() * 4),
      h: 4 + Math.floor(Math.random() * 6),
    }));
    setConfetti(pieces);
  }, []);

  return (
    <section
      id="resume"
      className="section"
      data-screen-label="06 Resume"
      style={{ background: 'var(--bg-section)' }}
    >
      {/* Corporate skyline — scattered along the street */}
      <div className="corp-street" style={{ left: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.google} floors={12} scale={5} rooftop="dome" />
      </div>
      <div className="corp-street" style={{ left: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.anthropic} floors={8} scale={3.5} rooftop="helipad" />
      </div>
      <div className="corp-street" style={{ left: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.openai} floors={6} scale={3} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ right: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.apple} floors={11} scale={5} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ right: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.nvidia} floors={8} scale={3.5} rooftop="billboard" />
      </div>
      <div className="corp-street" style={{ right: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.meta} floors={6} scale={3} rooftop="water-tower" />
      </div>

      {/* Falling confetti */}
      <div className="confetti-field" aria-hidden="true">
        {confetti.map((p, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              ['--rot' as string]: `${p.rot}deg`,
            }}
          />
        ))}
      </div>

      {/* Floating grad cap drifting across like a celebratory mascot */}
      <div className="gradcap-toss" style={{ top: 80 }} aria-hidden="true">
        <GradCap scale={2} />
      </div>
      <div className="gradcap-toss" style={{ top: 220, animationDelay: '-18s', animationDuration: '38s' }} aria-hidden="true">
        <GradCap scale={1.4} />
      </div>

      {/* A few academic data packets */}
      <span className="data-packet alt" style={{ top: 200, animationDelay: '-3s' }}>GPA · 3.80</span>
      <span className="data-packet" style={{ top: 360, animationDelay: '-8s' }}>commencement: TRUE</span>
      <span className="data-packet alt" style={{ top: 500, animationDelay: '-12s' }}>Dean&apos;s List · 7/8</span>

      <div className="container container-resume">
        <div className="section-eyebrow">
          <span className="sign pixel-sign">BLOCK 06</span>
          <span className="label">Commencement · CLASS OF &rsquo;26</span>
        </div>
        <h2 className="section-title">
          Class of <span className="accent">&rsquo;26.</span>
        </h2>
        <p className="section-sub">
          Diploma signed in pixels. Four years at MSU, plus the late-night lab hours that don&rsquo;t
          fit on a resume.
        </p>

        {/* ============== Diploma card ============== */}
        <div className="diploma-wrap">
          <div className="diploma-card">
            {/* Wax-seal style "VERIFIED" stamp */}
            <span className="diploma-seal">
              <span className="seal-ring" />
              <span className="seal-text">
                ★ VERIFIED ★<br />MSU 2026
              </span>
            </span>

            {/* Title bar — themed like an old certificate header */}
            <div className="diploma-header">
              <span className="caligraph">Bachelor of Science</span>
              <span className="diploma-school">
                Michigan State University · College of Engineering
              </span>
              <span className="pixel-divider" />
            </div>

            <div className="diploma-grid">
              {/* LEFT: pixel-art diploma + cap */}
              <div className="diploma-art">
                <div className="grad-cap-stack" aria-hidden="true">
                  <GradCap scale={3} />
                </div>
                <div className="diploma-scroll" aria-hidden="true">
                  <Diploma scale={2.6} />
                </div>
                <div className="medal-row" aria-hidden="true">
                  <Medal scale={1.8} />
                  <Medal scale={1.8} />
                  <Medal scale={1.8} />
                </div>
              </div>

              {/* RIGHT: credentials + awards */}
              <div className="diploma-body">
                <div className="cred-grid">
                  <div className="cred-row">
                    <span className="cred-label">DEGREE</span>
                    <span className="cred-value">
                      B.S. <strong>Computational Data Science</strong>
                    </span>
                  </div>
                  <div className="cred-row">
                    <span className="cred-label">MINOR</span>
                    <span className="cred-value">Mathematics</span>
                  </div>
                  <div className="cred-row">
                    <span className="cred-label">GPA</span>
                    <span className="cred-value">
                      <span className="gpa-number">3.80</span>
                      <span className="gpa-bar"><span style={{ width: `${(3.8 / 4.0) * 100}%` }} /></span>
                      <span className="gpa-max">/ 4.00</span>
                    </span>
                  </div>
                  <div className="cred-row">
                    <span className="cred-label">CONFERRED</span>
                    <span className="cred-value">May 2026 · East Lansing, MI</span>
                  </div>
                </div>

                <div className="awards-section">
                  <div className="label-mono awards-heading">★ HONORS &amp; AWARDS</div>
                  <div className="awards-grid">
                    {AWARDS.map((a) => (
                      <div key={a.label} className={`award-chip tone-${a.tone}`}>
                        <span className="award-dot" />
                        <span className="award-name">{a.label}</span>
                        <span className="award-year">{a.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="leadership-section">
                  <div className="label-mono awards-heading">✦ LEADERSHIP</div>
                  <ul className="leadership-list">
                    <li>
                      <strong>Resident Assistant</strong> · MSU Housing &amp; Residence Education ·
                      <span className="lead-meta"> supported 100+ residents · Aug 2024 – May 2026</span>
                    </li>
                    <li>
                      <strong>Co-Founder &amp; Exec Board</strong> · Polish Club at MSU ·
                      <span className="lead-meta"> Oct 2024 – May 2026</span>
                    </li>
                  </ul>
                </div>

                <div className="resume-cta">
                  <a
                    className="btn btn-primary resume-download"
                    href={getAssetPath('/resume.pdf')}
                    download="MichalBorek_Resume.pdf"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M12 4v12M6 12l6 6 6-6M4 20h16" />
                    </svg>
                    Download Resume.pdf
                  </a>
                  <a
                    className="btn btn-secondary"
                    href={getAssetPath('/resume.pdf')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M14 3h7v7M21 3l-9 9M5 5h6M5 5v14h14v-6" />
                    </svg>
                    Open in new tab
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   CONTACT
   ========================================================================= */
export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="section"
      data-screen-label="06 Contact"
      style={{ background: 'var(--bg-section)' }}
    >
      {/* Corporate skyline — scattered along the street */}
      <div className="corp-street" style={{ left: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.openai} floors={11} scale={5} rooftop="dome" />
      </div>
      <div className="corp-street" style={{ left: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.tesla} floors={7} scale={3.5} rooftop="antenna" />
      </div>
      <div className="corp-street" style={{ left: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.meta} floors={6} scale={3} rooftop="water-tower" />
      </div>
      <div className="corp-street" style={{ right: 'max(8px, calc(50% - 760px))' }}>
        <CorpBuilding {...CORP.google} floors={12} scale={5} rooftop="helipad" />
      </div>
      <div className="corp-street" style={{ right: 'max(80px, calc(50% - 690px))', opacity: 0.95 }}>
        <CorpBuilding {...CORP.nvidia} floors={9} scale={3.5} rooftop="billboard" />
      </div>
      <div className="corp-street" style={{ right: 'max(140px, calc(50% - 635px))', opacity: 0.8 }}>
        <CorpBuilding {...CORP.xai} floors={7} scale={3} rooftop="dome" />
      </div>
      {/* Ground-level: diner on left, hydrant + mailbox on right */}
      <div className="section-deco" style={{ bottom: 0, left: 30 }}>
        <Diner scale={3} />
      </div>
      <div className="section-deco" style={{ bottom: 0, right: 30, opacity: 0.85 }}>
        <Mailbox scale={2.4} />
      </div>
      <div className="section-deco" style={{ bottom: 0, right: 120, opacity: 0.85 }}>
        <Hydrant scale={2.6} />
      </div>
      <div className="flying-bird" style={{ top: 80, left: '-40px', animationDuration: '22s' }}>
        <span className="pigeon-flap">
          <Pigeon frame={0} scale={2} />
        </span>
      </div>
      <div
        className="flying-bird"
        style={{ top: 130, left: '-40px', animationDelay: '-6s', animationDuration: '26s' }}
      >
        <span className="pigeon-flap">
          <Pigeon frame={0} scale={1.8} />
        </span>
      </div>
      <div
        className="flying-bird"
        style={{ top: 110, left: '-40px', animationDelay: '-10s', animationDuration: '24s' }}
      >
        <span className="pigeon-flap">
          <Pigeon frame={0} scale={2.2} />
        </span>
      </div>

      {/* Paper plane delivering an envelope — primary mail-themed motif */}
      <div className="paperplane-drift" style={{ top: 60, animationDuration: '38s' }}>
        <PaperPlane scale={2.4} />
        <span className="paperplane-banner">MAIL FOR: M.BOREK · INBOX</span>
      </div>
      <div className="envelope-deliver" style={{ top: 220, animationDuration: '42s', animationDelay: '-12s' }}>
        <Envelope scale={2.4} />
      </div>
      <div className="envelope-deliver" style={{ top: 380, animationDuration: '48s', animationDelay: '-30s' }}>
        <Envelope scale={1.8} />
      </div>

      {/* Signal-wave concentric pulses emanating from each side — "transmitting" */}
      <div className="signal-tower left">
        <span className="signal-ring" />
        <span className="signal-ring" />
        <span className="signal-ring" />
      </div>
      <div className="signal-tower right">
        <span className="signal-ring" />
        <span className="signal-ring" />
        <span className="signal-ring" />
      </div>

      {/* Mail-themed data packets */}
      <span className="data-packet" style={{ top: 200, animationDelay: '-1s' }}>mailto: borek@</span>
      <span className="data-packet alt" style={{ top: 360, animationDelay: '-7s' }}>inbox · +1 unread</span>
      <span className="data-packet" style={{ top: 520, animationDelay: '-11s' }}>smtp: 250 OK</span>

      <div className="container">
        <div className="section-eyebrow">
          <span className="sign pixel-sign">BLOCK 07</span>
          <span className="label">Last stop</span>
        </div>
        <h2 className="section-title">
          Let&rsquo;s <span className="accent">talk.</span>
        </h2>
        <p className="section-sub">
          I respond within a day. Drop a note about a role, a project, or just say hi.
        </p>

        <div className="contact-grid">
          <div className="contact-card contact-info">
            <h3 style={{ marginBottom: 16 }}>How to reach me</h3>
            <div className="row">
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.7">
                  <path d="M2.5 6.5A2 2 0 0 1 4.5 4.5h15a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2zM3 7l9 6 9-6" />
                </svg>
              </span>
              <div>
                <div className="l">Email</div>
                <a href="mailto:borekmi1@msu.edu" className="v">
                  borekmi1@msu.edu
                </a>
              </div>
            </div>
            <div className="row">
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563EB">
                  <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
                </svg>
              </span>
              <div>
                <div className="l">GitHub</div>
                <a href="https://github.com/michaelborek" target="_blank" rel="noreferrer" className="v">
                  @michaelborek
                </a>
              </div>
            </div>
            <div className="row">
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563EB">
                  <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V9h3zM6.5 7.7A1.7 1.7 0 1 1 8.2 6a1.7 1.7 0 0 1-1.7 1.7zM19 19h-3v-5c0-1.2-.5-2-1.7-2A1.8 1.8 0 0 0 12.6 13a2.2 2.2 0 0 0-.1.7V19h-3V9h2.9v1.2A3 3 0 0 1 15.1 9c2 0 3.6 1.3 3.6 4z" />
                </svg>
              </span>
              <div>
                <div className="l">LinkedIn</div>
                <a
                  href="https://linkedin.com/in/michal-borek2003"
                  target="_blank"
                  rel="noreferrer"
                  className="v"
                >
                  michal-borek2003
                </a>
              </div>
            </div>
            <div className="row">
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563EB">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                </svg>
              </span>
              <div>
                <div className="l">Based in</div>
                <div className="v">East Lansing, MI — open to any US state + remote</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                padding: 16,
                background: 'rgba(45, 137, 84, 0.08)',
                border: '1px solid rgba(45, 137, 84, 0.2)',
                borderRadius: 10,
              }}
            >
              <div className="mono" style={{ color: 'var(--nyc-subway)', marginBottom: 4 }}>
                ● ACTIVELY INTERVIEWING
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink)' }}>
                Available for MLE / AI Engineer roles — anywhere in the US — starting Summer 2026.
              </div>
            </div>
          </div>

          <div className="contact-card">
            <h3 style={{ marginBottom: 16 }}>Send a note</h3>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 8px' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✦</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                  Message sent.
                </div>
                <p style={{ color: 'var(--ink-3)' }}>
                  Thanks for reaching out — you&rsquo;ll hear back from me within a day.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label className="label-mono" style={{ display: 'block', marginBottom: 6 }}>
                      Name
                    </label>
                    <input
                      className="input"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="label-mono" style={{ display: 'block', marginBottom: 6 }}>
                      Email
                    </label>
                    <input
                      className="input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      required
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="label-mono" style={{ display: 'block', marginBottom: 6 }}>
                    Message
                  </label>
                  <textarea
                    className="input"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={onChange}
                    required
                    placeholder="What are you building?"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   FOOTER
   ========================================================================= */
export function FooterSection() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span
                className="pixel-sign"
                style={{
                  fontSize: 10,
                  background: '#2D8954',
                  color: 'white',
                  padding: '4px 8px',
                  border: '2px solid white',
                  boxShadow: '2px 2px 0 0 white',
                }}
              >
                M
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Michal Borek
              </span>
            </div>
            <p style={{ marginTop: 8 }}>Machine Learning Engineer · MSU Spring &rsquo;26</p>
            <p
              className="mono"
              style={{ marginTop: 14, color: 'rgba(250,247,238,0.5)', fontSize: 11 }}
            >
              <span style={{ color: '#2D8954' }}>●</span> Currently shipping · v0.4.2
            </p>
          </div>
          <div>
            <h4>Sections</h4>
            <div className="links">
              <a href="#about">About</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#research">Research</a>
              <a href="#resume">Resume</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div>
            <h4>Find me</h4>
            <div className="links">
              <a href="mailto:borekmi1@msu.edu">borekmi1@msu.edu</a>
              <a href="https://github.com/michaelborek" target="_blank" rel="noreferrer">
                github.com/michaelborek
              </a>
              <a href="https://linkedin.com/in/michal-borek2003" target="_blank" rel="noreferrer">
                linkedin.com/in/michal-borek2003
              </a>
            </div>
          </div>
        </div>
        <div className="copyline">
          © {year} Michal Borek · made in pixels &amp; coffee · open to any US state · based in East
          Lansing
        </div>
      </div>
    </footer>
  );
}
