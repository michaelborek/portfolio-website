'use client';

import { ReactElement } from 'react';

/* =========================================================================
   Pixel art primitive — renders a character grid as a viewBox of <rect>s.
   Each sprite supplies its own palette so palette keys can collide cleanly
   between sprites (used to be a global table; per-sprite palettes are safer).
   ========================================================================= */
type Palette = Record<string, string>;

function PixelArt({
  rows,
  palette,
  scale = 3,
  className = '',
  style = {},
}: {
  rows: string[];
  palette: Palette;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const w = rows[0].length;
  const h = rows.length;
  const rects: ReactElement[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      const fill = palette[ch];
      if (!fill || fill === 'transparent') continue;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={fill} />,
      );
    }
  }
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={`pixel ${className}`.trim()}
      style={{ display: 'block', ...style }}
    >
      {rects}
    </svg>
  );
}

/* =========================================================================
   Michal palette (portrait + walking sprites share these keys)
   ========================================================================= */
const MICHAL_PAL: Palette = {
  '.': 'transparent',
  O: '#1A1F2E',
  o: '#3A2418',
  H: '#3A2418',
  h: '#5C3826',
  i: '#7A4E33',
  F: '#E0A685',
  f: '#C58866',
  C: '#F5D2B8',
  E: '#1A1F2E',
  W: '#FAF7EE',
  M: '#2A1308',
  m: '#4A2412',
  B: '#2E6F87',
  b: '#1A4458',
  L: '#88B7C7',
  P: '#1F2A40',
  K: '#0C0F1A',
};

const M_PORTRAIT = [
  '.....OOOOOOOOOO.......',
  '....OHHHHHHHHHHO......',
  '...OHhhhhhhhhhhHO.....',
  '..OHhhhhihhhhhhhHO....',
  '.OHhhhihhhhhhhhhhHO...',
  '.OhhFFFFFFFFFFFFhhO...',
  '.OhFCFFFFFFFFFFFhhO...',
  '.OhFFFFEWFFFFEWFhhO...',
  '.OhFFFFFFFFFFFFFhhO...',
  '.OhFFFFFFFFFFFFFhhO...',
  '.OhFffMMMMMMMMffFhO...',
  '.OhFfMMMMMMMMMMfFhO...',
  '.OhFffmmmmmmmmffFhO...',
  '.OhFFFFFFFFFFFFFhhO...',
  '..OhfFFFFFFFFFFfhO....',
  '...OhfffFFFFFFfhO.....',
  '....OOOOOOOOOOOO......',
  '...OBBBBBBLLBBBBBO....',
  '..OBBLLLBBBBBLLLBBBO..',
  '.OBBBBBBBBBBBBBBBBBBO.',
  'OBBBBBBBBBBBBBBBBBBBBO',
  'OBBBBBBBBBBBBBBBBBBBBO',
  'OBBBBBBBBBBBBBBBBBBBBO',
  '.OBBBbbbbbbbbbbbbbBBO.',
  '..OBBbbbbbbbbbbbbbBO..',
  '...OOOOOOOOOOOOOOOO...',
];

export function MichalPortrait({ scale = 6 }: { scale?: number }) {
  return <PixelArt rows={M_PORTRAIT} palette={MICHAL_PAL} scale={scale} />;
}

const M_STAND = [
  '....OOOOOOOO....',
  '...OHHHHHHHHO...',
  '..OHhhhhhhhhHO..',
  '..OhhFFFFFFhhO..',
  '.OhFFFFFFFFFhO..',
  '.OhFEWFFFFEWfhO.',
  '.OhFFFFFFFFFFhO.',
  '.OhFfMMMMMMfFhO.',
  '.OhFFFFFFFFFFhO.',
  '..OhfFFFFFFfhO..',
  '..OOOOOOOOOOOO..',
  '..OBBCBBBBCBBO..',
  '.OBBBBBBBBBBBBO.',
  'OBBBBBBBBBBBBBBO',
  'OBBBBBBBBBBBBBBO',
  '.OBBbbbbbbbbBBO.',
  '..OBBbbbbbbBBO..',
  '..OOOO....OOOO..',
  '..OPPP....PPPO..',
  '..OPPP....PPPO..',
  '..OKKK....KKKO..',
  '..OOOO....OOOO..',
];

const M_WALK_A = [
  '....OOOOOOOO....',
  '...OHHHHHHHHO...',
  '..OHhhhhhhhhHO..',
  '..OhhFFFFFFhhO..',
  '.OhFFFFFFFFFhO..',
  '.OhFEWFFFFEWfhO.',
  '.OhFFFFFFFFFFhO.',
  '.OhFfMMMMMMfFhO.',
  '.OhFFFFFFFFFFhO.',
  '..OhfFFFFFFfhO..',
  '..OOOOOOOOOOOO..',
  '..OBBCBBBBCBBO..',
  '.OBBBBBBBBBBBBO.',
  'OBBBBBBBBBBBBBO.',
  '.OBBBBBBBBBBBBBO',
  '..OBBbbbbbbBBO..',
  '...OBBbbbbBBO...',
  '..OOO......OOO..',
  '..OPP.......PP..',
  '...OPP.....OPP..',
  '..OKKK......KK..',
  '..OOOK.....KKKK.',
];

const M_WALK_B = [
  '....OOOOOOOO....',
  '...OHHHHHHHHO...',
  '..OHhhhhhhhhHO..',
  '..OhhFFFFFFhhO..',
  '.OhFFFFFFFFFhO..',
  '.OhFEWFFFFEWfhO.',
  '.OhFFFFFFFFFFhO.',
  '.OhFfMMMMMMfFhO.',
  '.OhFFFFFFFFFFhO.',
  '..OhfFFFFFFfhO..',
  '..OOOOOOOOOOOO..',
  '..OBBCBBBBCBBO..',
  '.OBBBBBBBBBBBBO.',
  '.OBBBBBBBBBBBBO.',
  '..OBBBBBBBBBBO..',
  '..OBBbbbbbbBBO..',
  '..OBBbbbbbbBBO..',
  '...OPPP..PPPO...',
  '...OPPP..PPPO...',
  '...OPPP..PPPO...',
  '...OKKK..KKKO...',
  '..OOOOO..OOOOO..',
];

export function MichalWalk({
  frame = 0,
  scale = 3,
  style,
}: {
  frame?: number;
  scale?: number;
  style?: React.CSSProperties;
}) {
  const rows = frame === 0 ? M_STAND : frame === 1 ? M_WALK_A : M_WALK_B;
  return <PixelArt rows={rows} palette={MICHAL_PAL} scale={scale} style={style} />;
}

/* =========================================================================
   AI Companion chip
   ========================================================================= */
const COMPANION_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', G: '#18D67E', W: '#FAF7EE', A: '#FAF7EE', s: '#3A2418' };
const COMPANION_A = [
  '....OO....',
  '....OO....',
  '..OOOOOO..',
  '.OGGGGGGOs',
  'OGGGGGGGGO',
  'OGGWAWAGGO',
  'OGGWWWAGGO',
  'OGGGGGGGGO',
  '.OGGGGGGOs',
  '..OOOOOO..',
];
const COMPANION_B = [
  '....OO....',
  '....OO....',
  '..OOOOOO..',
  'sOGGGGGGO.',
  'OGGGGGGGGO',
  'OGGAWAWGGO',
  'OGGAWWWGGO',
  'OGGGGGGGGO',
  'sOGGGGGGO.',
  '..OOOOOO..',
];
export function Companion({ frame = 0, scale = 3 }: { frame?: number; scale?: number }) {
  return <PixelArt rows={frame === 0 ? COMPANION_A : COMPANION_B} palette={COMPANION_PAL} scale={scale} />;
}

/* =========================================================================
   Yellow cab
   ========================================================================= */
const CAB_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', Y: '#F8B324', y: '#E89215', W: '#FAF7EE', R: '#C9342B', K: '#0C0F1A' };
const CAB = [
  '............................',
  '............................',
  '......OOOOOOOOOOOOO.........',
  '....OOYYYYYYYYYYYYYO........',
  '..OOYYYWWWWWWYYYYYYYYO......',
  'OOOOYYYWWWWWWYYYYYYYYYOOOOOO',
  'OYYYYYYYYYYYYYYYYYYYYYYYYYYO',
  'OYYRRYYYYRYYYRYYRYYRYYYYRYYO',
  'OYYRRYYYYRYYYRYYRYYRYYYYRYYO',
  'OYYYYYYYYYYYYYYYYYYYYYYYYYYO',
  'OyyyOOOyyyyyyyyyyyOOOyyyyyyO',
  'OOOOOKKOOOOOOOOOOOKKOOOOOOOO',
  '....OOKK........OOKK........',
  '....OOOO........OOOO........',
];
export function Cab({ scale = 2.5 }: { scale?: number }) {
  return <PixelArt rows={CAB} palette={CAB_PAL} scale={scale} />;
}

/* =========================================================================
   Pigeon (two flap frames)
   ========================================================================= */
const PIGEON_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', S: '#9CA3B0', E: '#1A1F2E', W: '#FAF7EE' };
const PIGEON_A = [
  '....OOOO..',
  '..OOSSSSO.',
  '.OSSSSSEWO',
  'OSSSSSSSSO',
  '.OSSSSOOO.',
  '..OOOO....',
];
const PIGEON_B = [
  '..OOOOOO..',
  'OSSSSSSSSO',
  'OSSSSSSEWO',
  'OSSSSSSSSO',
  '.OSSSSOOO.',
  '..OOOO....',
];
export function Pigeon({ frame = 0, scale = 3 }: { frame?: number; scale?: number }) {
  return <PixelArt rows={frame === 0 ? PIGEON_A : PIGEON_B} palette={PIGEON_PAL} scale={scale} />;
}

/* =========================================================================
   Subway pin — pure CSS
   ========================================================================= */
export function SubwaySign({ letter = 'M', size = 36 }: { letter?: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#2D8954',
        border: '3px solid #1A1F2E',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: "'Geist', sans-serif",
        fontSize: size * 0.5,
        fontWeight: 700,
        boxShadow: '2px 2px 0 0 #1A1F2E',
      }}
    >
      {letter}
    </div>
  );
}

/* =========================================================================
   Buildings — programmatic SVG rather than pixel art
   ========================================================================= */
type BuildingProps = {
  width?: number;
  height?: number;
  color?: string;
  windowColor?: string;
  cols?: number;
  rows?: number;
  blinkEvery?: number;
};
export function Building({
  width = 120,
  height = 220,
  color = '#9CA3B0',
  windowColor = '#FCD34D',
  cols = 4,
  rows = 7,
  blinkEvery = 5,
}: BuildingProps) {
  const cellW = width / cols;
  const cellH = height / rows;
  const windows: ReactElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const blink = (r * cols + c) % blinkEvery === 0;
      const x = c * cellW + cellW * 0.2;
      const y = r * cellH + cellH * 0.18;
      const w = cellW * 0.6;
      const h = cellH * 0.6;
      windows.push(
        <rect
          key={`${r}-${c}`}
          x={x}
          y={y}
          width={w}
          height={h}
          className={blink ? 'window-blink' : ''}
          fill={blink ? windowColor : '#5C6173'}
        />,
      );
    }
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
    >
      <rect x="0" y="0" width={width} height={height} fill={color} />
      <rect x="0" y="0" width={width} height="4" fill="#1A1F2E" />
      <rect x="0" y="0" width="3" height={height} fill="#1A1F2E" />
      <rect x={width - 3} y="0" width="3" height={height} fill="#1A1F2E" />
      {windows}
      <rect x={width * 0.3} y="-12" width={width * 0.4} height="14" fill={color} />
      <rect x={width * 0.3} y="-12" width="3" height="14" fill="#1A1F2E" />
      <rect x={width * 0.7 - 3} y="-12" width="3" height="14" fill="#1A1F2E" />
      <rect x={width * 0.3} y="-12" width={width * 0.4} height="3" fill="#1A1F2E" />
    </svg>
  );
}

/* =========================================================================
   DINER — a small NYC-style street-level restaurant. Brick facade, awning,
   big window, neon "DINER" sign. ~26 cells wide × 22 tall.
   ========================================================================= */
const DINER_PAL: Palette = {
  '.': 'transparent',
  O: '#1A1F2E',
  R: '#C9342B',
  r: '#8E2018',
  W: '#FAF7EE',
  Y: '#FCD34D',
  K: '#0C0F1A',
  B: '#C77860', // brick
  b: '#6E3A28', // brick mortar
  G: '#2D8954', // neon glow
  S: '#5C6173', // sidewalk gray
  N: '#2563EB', // window glass tint
  n: '#1A4458',
};
const DINER = [
  '..........................',
  '...........OOOOOO.........',  // chimney
  '...........OssssO.........',
  '..OOOOOOOOOOOOOOOOOOOOOOO.',  // roof line
  '.OBbBbBbBbBbBbBbBbBbBbBbBO',  // top brick row
  'OBBbBBbBBbBBbBBbBBbBBbBBbO',
  'ORRRRRRRRRRRRRRRRRRRRRRRO.',  // awning (red stripe)
  'OWWRRWWRRWWRRWWRRWWRRWWRO.',  // awning (red/white)
  'OYYYYYYYYYYYYYYYYYYYYYYYO.',  // neon sign band
  'OOOOOOOOOOOOOOOOOOOOOOOOO.',
  'OBbBbBBNNNNNNNNNNBBbBbBbO.',  // window row 1
  'OBBbBBNnnnnnnnnnNBBbBBbBO.',
  'OBbBBBNnnnnnnnnnNBbBBBbBO.',  // window row 3
  'OBBbBBNnnnnnnnnnNBBbBBbBO.',
  'OBbBbBBNNNNNNNNNNBBbBbBbO.',  // bottom of window
  'OBBbBBbBBOOOOBBbBBbBBbBBBO',  // door area
  'OBbBbBbBOWWOOBbBbBbBbBbBO.',  // door row 1
  'OBBbBBbBOWWOOBBbBBbBBbBBO.',
  'OBbBBBbBOWWOOBBbBbBbBbBBO.',  // door row 3
  'OBBbBBbBOOOOOBBbBBbBBbBBO.',
  'OOOOOOOOOOOOOOOOOOOOOOOOO.',  // sidewalk
  'OSSSSSSSSSSSSSSSSSSSSSSSO.',
];
export function Diner({ scale = 3 }: { scale?: number }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', imageRendering: 'pixelated' }}>
      <PixelArt rows={DINER} palette={DINER_PAL} scale={scale} />
      {/* Neon "DINER" sign overlay on the yellow band */}
      <div
        style={{
          position: 'absolute',
          top: 8 * scale,
          left: scale,
          right: scale,
          height: scale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: Math.max(6, Math.floor(scale * 0.9)),
          color: '#C9342B',
          letterSpacing: '0.14em',
          pointerEvents: 'none',
          lineHeight: 1,
          textShadow: `0 0 ${scale}px rgba(252,211,77,0.7)`,
        }}
      >
        ★ DINER ★
      </div>
    </div>
  );
}

/* =========================================================================
   NEWS STAND — small kiosk with a pile of papers and an awning.
   ========================================================================= */
const STAND_PAL: Palette = {
  '.': 'transparent',
  O: '#1A1F2E',
  G: '#2D8954',
  g: '#1B5C36',
  Y: '#FCD34D',
  W: '#FAF7EE',
  K: '#5C6173',
  k: '#3A4150',
  R: '#C9342B',
  P: '#9CA3B0', // newspapers stacked
};
const STAND = [
  '...........',
  '...OOOOO...',  // umbrella peak
  '..OGGGGGO..',
  '.OGggGggGO.',
  'OGGgGGGgGGO',
  'OYYYYYYYYYO',  // awning stripe
  '.OOOOOOOOO.',
  '.OGGGGGGGGO',  // back wall
  '.OGgWWWWgGO',  // window/posters area
  '.OGgWRRWgGO',
  '.OGgWWWWgGO',
  '.OGGgggggGO',  // counter
  '.OOOOOOOOOO',
  '.OPPPP.PPP.',  // newspaper stacks on sidewalk
  '.OPPPP.PPP.',
  '..OOOO.OOO.',
];
export function NewsStand({ scale = 3 }: { scale?: number }) {
  return <PixelArt rows={STAND} palette={STAND_PAL} scale={scale} />;
}

/* =========================================================================
   Corporate skyscraper — a true pixel-grid tower with brand marquee, glowing
   neon, optional rooftop variants (antenna / water tower / dome / billboard /
   helipad), an animated aircraft warning light, brand-color ground halo,
   and a pixel-art ground sign with the brand initial.
   ========================================================================= */
export type CorpRooftop = 'antenna' | 'water-tower' | 'dome' | 'billboard' | 'helipad';

export function CorpBuilding({
  name,
  brand,
  textColor = '#FFFFFF',
  facade = '#5C6173',
  facadeShade = '#3A4150',
  windowLit = '#FCD34D',
  windowDark = '#1F2A40',
  floors = 11,
  scale = 6,
  rooftop = 'antenna',
}: {
  name: string;
  brand: string;
  textColor?: string;
  facade?: string;
  facadeShade?: string;
  windowLit?: string;
  windowDark?: string;
  floors?: number;
  scale?: number;
  rooftop?: CorpRooftop;
}) {
  // Geometry: 5 windows across with 1-cell spacers = 11 cells of facade,
  // plus 1-cell outline each side → 13 cells wide.
  const winCols = 5;
  const inner = winCols * 2 + 1; // 11
  const totalW = inner + 2; // 13
  const SIGN_ROWS = 5;

  // ---- Rooftop variants — extra pixel rows prepended above the tower ----
  // Each row is exactly `totalW` (13) cells wide so geometry stays clean.
  const ROOFTOPS: Record<CorpRooftop, string[]> = {
    antenna: [
      '......R......',
      '......A......',
      '......A......',
      '....OAAAO....',
      '......A......',
      '......A......',
      '.....OAO.....',
      '....OOOOO....',
    ],
    'water-tower': [
      '......t......',
      '....OOOOO....',
      '...OTTTTTO...',
      '..OTBBTBBTO..',
      '..OTTTTTTTO..',
      '..OTBBTBBTO..',
      '..OTTTTTTTO..',
      '..OOOOOOOOO..',
      '...O.O.O.O...',
      '...O.O.O.O...',
    ],
    dome: [
      '......R......',
      '......A......',
      '.....OOOOO...',
      '....OSSSSSO..',
      '...OSSSSSSSO.',
      '..OSSSSSSSSSO',
      '.OOOOOOOOOOOO',
    ],
    billboard: [
      '..OOOOOOOOO..',
      '..ONNNNNNNO..',
      '..ONSSSSSNO..',
      '..ONSSSSSNO..',
      '..ONSSSSSNO..',
      '..ONNNNNNNO..',
      '..OOOOOOOOO..',
      '.....O.O.....',
      '.....O.O.....',
      '....OOOOO....',
    ],
    helipad: [
      '..OOOOOOOOO..',
      '.OYYYHHHYYYO.',
      '.OYYYYHYYYYO.',
      '.OYHHHHHHHYO.',
      '.OYYYYHYYYYO.',
      '.OYYYHHHYYYO.',
      '..OOOOOOOOO..',
      '....O...O....',
      '...OOO.OOO...',
    ],
  };

  const rows: string[] = [];
  rows.push(...ROOFTOPS[rooftop]);
  rows.push('O'.repeat(totalW)); // top cornice
  for (let s = 0; s < SIGN_ROWS; s++) {
    rows.push('O' + 'S'.repeat(inner) + 'O'); // brand-colored marquee band
  }
  rows.push('O' + 'f'.repeat(inner) + 'O'); // sign bottom trim
  for (let f = 0; f < floors; f++) {
    let win = '.';
    for (let c = 0; c < winCols; c++) {
      // Lit cascade pattern — diagonal stripe of warm windows
      const lit = (c + f) % 3 === 0;
      win += (lit ? 'L' : 'D') + '.';
    }
    rows.push('O' + win + 'O'); // window row 1
    rows.push('O' + win + 'O'); // window row 2 (2-cell tall windows)
    rows.push('O' + 'f'.repeat(inner) + 'O'); // floor separator
  }
  // Glowing ground-floor entrance — brand-colored door + side lit windows.
  // 13 cells: O . E . S . S . S . E . O
  rows.push('O' + 'f'.repeat(inner) + 'O');
  rows.push('O.E.S.S.S.E.O');
  rows.push('O.E.S.S.S.E.O');
  rows.push('O'.repeat(totalW)); // base
  rows.push('O'.repeat(totalW)); // base shadow

  const palette: Palette = {
    '.': facade,
    O: '#0A0E1A',
    f: facadeShade,
    L: windowLit,
    D: windowDark,
    S: brand,
    R: '#C9342B', // aircraft warning red (also styled via CSS for glow)
    A: '#9CA3B0', // antenna steel
    T: '#8C6B4F', // water tower wood
    B: '#5C3A28', // water tower bands
    t: '#5C6173', // small antenna on tower top
    Y: '#FCD34D', // helipad yellow paint
    H: '#FAF7EE', // helipad H
    N: '#1A1F2E', // billboard frame
    E: '#FCD34D', // entrance lit windows
  };

  // Marquee text overlay position — must account for the rooftop rows
  // (the building's first cornice row sits at rooftop.length, the brand band
  // starts one row below it).
  const rooftopRows = ROOFTOPS[rooftop].length;
  const signTopPx = (rooftopRows + 1) * scale;
  const signHeightPx = SIGN_ROWS * scale;
  const totalHeightPx = rows.length * scale;
  const totalWidthPx = totalW * scale;

  // Aircraft warning light overlay (animated CSS glow) — only for antenna/dome rooftops.
  const showAircraftLight = rooftop === 'antenna' || rooftop === 'dome';
  const lightCol = rooftop === 'antenna' ? 6 : 6;
  const lightRow = 0;

  // Billboard overlay text (for the billboard rooftop only).
  const billboardText = name.length <= 6 ? name : name.slice(0, 5) + '.';

  return (
    <div
      className="corp-tower-wrap"
      style={{
        position: 'relative',
        display: 'inline-block',
        imageRendering: 'pixelated',
      }}
    >
      {/* Brand-colored back glow halo */}
      <span
        className="corp-back-glow"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${brand}55 0%, ${brand}00 65%)`,
          width: totalWidthPx * 1.5,
          height: totalHeightPx,
          left: -totalWidthPx * 0.25,
        }}
      />

      <PixelArt rows={rows} palette={palette} scale={scale} />

      {/* Glowing marquee text */}
      <div
        className="corp-marquee"
        style={{
          top: signTopPx,
          left: scale,
          width: totalWidthPx - 2 * scale,
          height: signHeightPx,
          fontSize: Math.max(7, Math.floor(scale * 1.4)),
          color: textColor,
          textShadow: `0 0 ${scale}px ${brand}, 0 0 ${scale * 2}px ${brand}, 0 1px 0 rgba(0,0,0,0.45)`,
        }}
      >
        <span className="corp-marquee-text">{name}</span>
      </div>

      {/* Neon halo around the marquee band — drawn as a glowing outline */}
      <span
        className="corp-marquee-halo"
        style={{
          top: signTopPx - 2,
          left: scale - 2,
          width: totalWidthPx - 2 * scale + 4,
          height: signHeightPx + 4,
          boxShadow: `0 0 ${scale * 1.5}px ${brand}, inset 0 0 ${scale}px ${brand}66`,
          border: `1px solid ${brand}`,
        }}
      />

      {/* Vertical neon side sign — brand letters cascading down */}
      {name.length <= 9 && (
        <div
          className="corp-side-sign"
          style={{
            right: -Math.max(8, scale * 1.3),
            top: signTopPx + signHeightPx + scale * 4,
            color: brand,
            textShadow: `0 0 ${scale}px ${brand}, 0 0 ${scale * 2}px ${brand}`,
            fontSize: Math.max(6, Math.floor(scale * 1.1)),
          }}
        >
          {name.split('').map((ch, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.18}s` }}>
              {ch}
            </span>
          ))}
        </div>
      )}

      {/* Blinking aircraft warning light (antenna rooftops only) */}
      {showAircraftLight && (
        <span
          className="corp-aircraft-light"
          style={{
            top: lightRow * scale - scale * 0.4,
            left: lightCol * scale - scale * 0.4,
            width: scale * 1.8,
            height: scale * 1.8,
          }}
        />
      )}

      {/* Billboard overlay text (billboard rooftops only) */}
      {rooftop === 'billboard' && (
        <div
          className="corp-billboard-text"
          style={{
            top: scale * 2,
            left: 0,
            right: 0,
            color: brand,
            textShadow: `0 0 ${scale * 0.8}px ${brand}, 0 0 ${scale * 1.6}px ${brand}`,
            fontSize: Math.max(6, Math.floor(scale * 1.1)),
          }}
        >
          {billboardText}
        </div>
      )}

      {/* Ground halo — pool of brand-colored light at the base */}
      <span
        className="corp-ground-halo"
        style={{
          background: `radial-gradient(ellipse at center, ${brand}77 0%, ${brand}00 70%)`,
          width: totalWidthPx * 1.4,
          left: -totalWidthPx * 0.2,
          bottom: -scale * 2,
          height: scale * 6,
        }}
      />
    </div>
  );
}

export function BrickBuilding(props: BuildingProps) {
  return (
    <Building
      width={110}
      height={200}
      cols={3}
      rows={6}
      color="#C77860"
      windowColor="#FCD34D"
      blinkEvery={4}
      {...props}
    />
  );
}

export function StoneBuilding(props: BuildingProps) {
  return (
    <Building
      width={130}
      height={240}
      cols={5}
      rows={8}
      color="#C8CDD5"
      windowColor="#FCD34D"
      blinkEvery={6}
      {...props}
    />
  );
}

/* =========================================================================
   Cloud
   ========================================================================= */
const CLOUD_PAL: Palette = { '.': 'transparent', l: '#FFFFFF', q: '#E0E4EB' };
const CLOUD = [
  '....llllllll....',
  '..llllllllllll..',
  '.llllllllllllll.',
  'llllllllllllllll',
  'llllllllllllllll',
  '.qqqqqqqqqqqqqq.',
  '..qq..qq..qq.qq.',
];
export function Cloud({ scale = 4 }: { scale?: number }) {
  return <PixelArt rows={CLOUD} palette={CLOUD_PAL} scale={scale} />;
}

/* =========================================================================
   Moon
   ========================================================================= */
const MOON_PAL: Palette = { '.': 'transparent', W: '#FCF5C8', w: '#E8DBA0', g: '#C7B57F', O: '#1A1F2E' };
const MOON = [
  '.....OOOOOO.....',
  '...OOWWWWWWOO...',
  '..OWWWWWWWWgwO..',
  '.OWWWWWWWWwwgO.',
  '.OWWWWWwWWwwwgO',
  'OWWWWWwWWWwwwgO',
  'OWWWWWWWwwwggOO',
  'OWWWWWWWwwgggO.',
  'OWWWWWwwwgggOO.',
  'OWWwwwwwgggOO..',
  '.OwwwwwgggOO...',
  '.OwwwgggggOO...',
  '..OgggggggO....',
  '...OOggggOO....',
  '.....OOOOO.....',
  '................',
];
export function Moon({ scale = 4 }: { scale?: number }) {
  return <PixelArt rows={MOON} palette={MOON_PAL} scale={scale} />;
}

/* =========================================================================
   Sun
   ========================================================================= */
const SUN_PAL: Palette = { '.': 'transparent', O: '#E89215', Y: '#FCD34D', y: '#F8B324', W: '#FFF7CC' };
const SUN = [
  '....OOOOOO....',
  '..OOYYYYYYOO..',
  '.OYYYWYYYYYYO.',
  '.OYWWWYYYYYYO.',
  'OYYWWYYYYYYyO',
  'OYYYYYYYYYYyO',
  'OYYYYYYYYyyyO',
  'OYYYYYYYyyyyO',
  '.OYYYYYyyyyO.',
  '.OOyyyyyyyOO.',
  '....OOOOOO....',
];
export function Sun({ scale = 4 }: { scale?: number }) {
  return <PixelArt rows={SUN} palette={SUN_PAL} scale={scale} />;
}

/* =========================================================================
   Star + Starfield
   ========================================================================= */
export function Star({
  scale = 2,
  color = '#FCF5C8',
  twinkle = false,
}: {
  scale?: number;
  color?: string;
  twinkle?: boolean;
}) {
  return (
    <svg
      width={5 * scale}
      height={5 * scale}
      viewBox="0 0 5 5"
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
      className={twinkle ? 'star-twinkle' : ''}
    >
      <rect x="2" y="0" width="1" height="1" fill={color} />
      <rect x="2" y="2" width="1" height="1" fill={color} />
      <rect x="2" y="4" width="1" height="1" fill={color} />
      <rect x="0" y="2" width="1" height="1" fill={color} />
      <rect x="4" y="2" width="1" height="1" fill={color} />
      <rect x="1" y="1" width="1" height="1" fill={color} fillOpacity="0.6" />
      <rect x="3" y="1" width="1" height="1" fill={color} fillOpacity="0.6" />
      <rect x="1" y="3" width="1" height="1" fill={color} fillOpacity="0.6" />
      <rect x="3" y="3" width="1" height="1" fill={color} fillOpacity="0.6" />
    </svg>
  );
}

export function StarField({ count = 60, seed = 7 }: { count?: number; seed?: number }) {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const stars: ReactElement[] = [];
  for (let i = 0; i < count; i++) {
    const left = rnd() * 100;
    const top = rnd() * 65;
    const sc = 1 + Math.floor(rnd() * 3);
    const delay = rnd() * 4;
    const dur = 2 + rnd() * 3;
    stars.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          animation: `star-twinkle ${dur}s ease-in-out ${delay}s infinite`,
        }}
      >
        <Star scale={sc} />
      </div>,
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>{stars}</div>
  );
}

/* =========================================================================
   Street props
   ========================================================================= */
const HYDRANT_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', R: '#C9342B', r: '#8E2018', L: '#E26A60', Y: '#FCD34D' };
const HYDRANT = [
  '..OOOO..',
  '.OYYYYO.',
  '.OYYYYO.',
  'OORRRROO',
  'ORLRRRRO',
  'ORRRRrRO',
  'ORLRRrRO',
  'ORRRRRRO',
  'OOORROOO',
  '.OORROO.',
  '.OOOOOO.',
  'OOOOOOOO',
];
export function Hydrant({ scale = 3 }: { scale?: number }) {
  return <PixelArt rows={HYDRANT} palette={HYDRANT_PAL} scale={scale} />;
}

const MAILBOX_PAL: Palette = {
  '.': 'transparent',
  O: '#1A1F2E',
  B: '#2563EB',
  b: '#1A4DB8',
  L: '#5C8DF0',
  W: '#FAF7EE',
  R: '#C9342B',
};
const MAILBOX = [
  '..OOOOOOOO..',
  '.OBBLLLLBBO.',
  'OBLBBBBBBLBO',
  'OBBBBBBBBBBO',
  'OBLBBWWBBLBO',
  'OBBBBWWBBBBO',
  'OBLBBBBBBLBO',
  'OBbbbbbbbbBO',
  'OBBbbbbbbBBO',
  '.OObbbbbbOO.',
  '..OObbbbOO..',
  '...OOOOOO...',
  '....OO.OO...',
  '....OO.OO...',
];
export function Mailbox({ scale = 3 }: { scale?: number }) {
  return <PixelArt rows={MAILBOX} palette={MAILBOX_PAL} scale={scale} />;
}

const TRASH_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', S: '#5C6173', s: '#3A4150', g: '#2D8954' };
const TRASH = [
  '.OOOOOOOO.',
  'OSSSSSSSSO',
  'OS.S.S.S.O',
  'OSgSgSgS.O',
  'OS.S.S.S.O',
  'OSSSSSSSSO',
  'OS.S.S.S.O',
  'OSSsSSsSSO',
  'OS.S.S.S.O',
  'OSSSSSSSSO',
  '.OssssssO.',
  '.OOOOOOOO.',
];
export function TrashCan({ scale = 3 }: { scale?: number }) {
  return <PixelArt rows={TRASH} palette={TRASH_PAL} scale={scale} />;
}

const BENCH_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', W: '#8C6B4F', w: '#6E4F38', S: '#5C6173' };
const BENCH = [
  '.OOOOOOOOOOOOOOOOOOOOOO.',
  'OWWWWWWWWWWWWWWWWWWWWWWO',
  'OwwwwwwwwwwwwwwwwwwwwwwO',
  'OOOOOOOOOOOOOOOOOOOOOOOO',
  '.O.S................S.O.',
  '.O.S................S.O.',
  '.O.S................S.O.',
  '.OOOO..............OOOO.',
];
export function Bench({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={BENCH} palette={BENCH_PAL} scale={scale} />;
}

/* =========================================================================
   Sky life
   ========================================================================= */
const PLANE_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', W: '#FAF7EE', G: '#62B6CB', R: '#C9342B' };
const PLANE = [
  '..........OOO...........',
  '..........OWWO..........',
  'OOOOOOOOOOOWWWOOOOOO....',
  'OWWGGWWGGWWWWWWWWWWWO...',
  'OWWWWWWWWWWWWWWWWWWWO...',
  'OOOOOOWWWWWWOOOOOOOO....',
  '....OOOOOWWWOOOO........',
];
export function Plane({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={PLANE} palette={PLANE_PAL} scale={scale} />;
}

const BLIMP_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', W: '#FAF7EE', R: '#C9342B', B: '#2563EB' };
const BLIMP = [
  '....OOOOOOOOOOOOOOOOOOO.....',
  '..OOWWWWWWWWWWWWWWWWWWWOO...',
  '.OWWWWWWWRRRRWWWBBBBWWWWWO..',
  'OWWWWWWWWRRRRWWWBBBBWWWWWWO.',
  'OWWWWWWWWWWWWWWWWWWWWWWWWWWO',
  '.OWWWWWWWWWWWWWWWWWWWWWWWWO.',
  '..OOWWWWWWWWWWWWWWWWWWWWOO..',
  '..........OOOOOOOO..........',
];
export function Blimp({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={BLIMP} palette={BLIMP_PAL} scale={scale} />;
}

const HELICOPTER_PAL: Palette = {
  '.': 'transparent',
  O: '#1A1F2E',
  W: '#E36059',
  w: '#A12E2A',
  G: '#62B6CB',
  r: '#2A3043',
};
const HELICOPTER = [
  '......OOOOOOO.....',
  '....OOWWWWWWWOO...',
  '...OWGGWWWWWWWWO..',
  '..OWWWWWWWWWWWWOOO',
  '..OwwwwwwwwwwwwwwO',
  '..OOOOOOOOOOOOOOOO',
  '....OO........O...',
  '...OWWO......O....',
  '..OOOOOO..........',
];
export function Helicopter({ scale = 2 }: { scale?: number }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        className="chopper-rotor"
        style={{
          position: 'absolute',
          top: -2 * scale,
          left: 4 * scale,
          width: 20 * scale,
          height: 2 * scale,
          background: '#1A1F2E',
        }}
      />
      <PixelArt rows={HELICOPTER} palette={HELICOPTER_PAL} scale={scale} />
    </div>
  );
}

const BALLOON_PAL: Palette = {
  '.': 'transparent',
  O: '#1A1F2E',
  R: '#C9342B',
  Y: '#FCD34D',
  B: '#2563EB',
  W: '#FAF7EE',
  T: '#8C6B4F',
  t: '#6E4F38',
};
const BALLOON = [
  '....OOOOOO....',
  '..OOYYYYYYOO..',
  '.OYYRRYYRRYYO.',
  'OYYRRYYYYRRYYO',
  'OYRRYBBBBYRRYO',
  'OYRRYBBBBYRRYO',
  'OYYRRYYYYRRYYO',
  '.OYYRRYYRRYYO.',
  '..OOYYYYYYOO..',
  '....OOOOOO....',
  '.....O..O.....',
  '.....O..O.....',
  '.....O..O.....',
  '....OOOOOO....',
  '...OTTtttttTO.',
  '...OTtttttttO.',
  '...OTttttttTO.',
  '....OOOOOOOO..',
];
export function HotAirBalloon({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={BALLOON} palette={BALLOON_PAL} scale={scale} />;
}

const SATELLITE_PAL: Palette = {
  '.': 'transparent',
  O: '#1A1F2E',
  B: '#2A3043',
  b: '#3D4A6A',
  W: '#C8CDD5',
  Y: '#FCD34D',
};
const SATELLITE = [
  '..OO......OO..',
  '.OBBO....OBBO.',
  '.ObBO....OBbO.',
  '..OO.OOOO.OO..',
  '....OWWWWO....',
  '....OYWWYO....',
  '....OWWWWO....',
  '.....OOOO.....',
  '......OO......',
];
export function Satellite({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={SATELLITE} palette={SATELLITE_PAL} scale={scale} />;
}

const MANHOLE_PAL: Palette = { '.': 'transparent', O: '#1A1F2E', S: '#3A4150', s: '#5C6173' };
const MANHOLE = [
  '..OOOOOOOOOO..',
  '.OSsSsSsSsSsSO',
  '..OOOOOOOOOO..',
];
export function Manhole({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={MANHOLE} palette={MANHOLE_PAL} scale={scale} />;
}

/* =========================================================================
   FBI agent — frame 0/1/2 toggles a gleam on the sunglasses lenses.
   ========================================================================= */
export function FbiAgent({
  scale = 3,
  frame = 0,
  flipped = false,
}: {
  scale?: number;
  frame?: number;
  flipped?: boolean;
}) {
  const pal: Palette = {
    '.': 'transparent',
    O: '#0A0E1A',
    s: '#1A1F2E',
    F: '#E0B6A0',
    f: '#C28E78',
    E: '#0A0E1A',
    e: '#FAF7EE',
    B: '#14192A',
    b: '#0A0E1A',
    W: '#F0EAD8',
    t: '#C9342B',
    m: '#5C3826',
    Y: '#FCD34D',
    w: '#9CA3B0',
  };
  const E0 = 'EEEEEEEE';
  const E1 = 'EEeEEEEE';
  const E2 = 'EEEEEEeE';
  const eyes = frame === 0 ? E0 : frame === 1 ? E1 : E2;
  const rows = [
    '...OOOOOO...',
    '..OssssssO..',
    '..OsFFFFsO..',
    '..OFFFFFFO..',
    '..OFFFFFFOY.',
    '..O' + eyes.slice(0, 6) + 'O..',
    '..OFFFFFFOw.',
    '..OFFmmFFO..',
    '..OBBBBBBO..',
    '.OBBWttWBBO.',
    'OBBBWttWBBBO',
    'OBBbWttWbBBO',
    'OBBBBBBBBBBO',
    'OBBBBBBBBBBO',
    '.OBBBBBBBBO.',
    '.OBBBOOBBBO.',
    '.OBBBOOBBBO.',
    '.OBBBOOBBBO.',
    '.OBBBOOBBBO.',
    '.OBBBOOBBBO.',
    '.OBBBOOBBBO.',
    'OOOOO..OOOOO',
  ];
  return (
    <div style={{ display: 'inline-block', transform: flipped ? 'scaleX(-1)' : 'none' }}>
      <PixelArt rows={rows} palette={pal} scale={scale} />
    </div>
  );
}

/* =========================================================================
   Tech icons — inline SVG for the skills list
   ========================================================================= */
export const Icons: Record<string, ReactElement> = {
  python: (
    <svg width="22" height="22" viewBox="0 0 24 24" shapeRendering="crispEdges">
      <rect x="6" y="2" width="12" height="11" rx="2" fill="#3776AB" />
      <rect x="6" y="11" width="12" height="11" rx="2" fill="#FFD43B" />
      <rect x="9" y="5" width="2" height="2" fill="#fff" />
      <rect x="13" y="17" width="2" height="2" fill="#1A1F2E" />
    </svg>
  ),
  sql: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <ellipse cx="12" cy="6" rx="8" ry="2.5" fill="#5C6173" />
      <rect x="4" y="6" width="16" height="12" fill="#5C6173" />
      <ellipse cx="12" cy="18" rx="8" ry="2.5" fill="#3A4150" />
    </svg>
  ),
  pytorch: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M12 3l-5 5a7 7 0 1 0 10 0z" fill="#EE4C2C" />
      <circle cx="14" cy="6" r="1.4" fill="#fff" />
    </svg>
  ),
  tensorflow: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M12 2L2 7v10l10 5 10-5V7z" fill="#FF6F00" fillOpacity="0.85" />
    </svg>
  ),
  pandas: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="4" y="3" width="4" height="18" fill="#150458" />
      <rect x="10" y="6" width="4" height="12" fill="#E70488" />
      <rect x="16" y="3" width="4" height="18" fill="#FFCA00" />
    </svg>
  ),
  fastapi: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#009688" />
      <path d="M11 4L6 14h4l-1 6 6-10h-4z" fill="#fff" />
    </svg>
  ),
  docker: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="2" y="11" width="3" height="3" fill="#2496ED" />
      <rect x="6" y="11" width="3" height="3" fill="#2496ED" />
      <rect x="10" y="11" width="3" height="3" fill="#2496ED" />
      <rect x="14" y="11" width="3" height="3" fill="#2496ED" />
      <rect x="6" y="7" width="3" height="3" fill="#2496ED" />
      <rect x="10" y="7" width="3" height="3" fill="#2496ED" />
      <rect x="10" y="3" width="3" height="3" fill="#2496ED" />
      <path d="M2 14a8 8 0 0 0 16 0z" fill="#2496ED" />
    </svg>
  ),
  nextjs: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1A1F2E" />
      <path d="M8 6v12L17 6" stroke="#fff" strokeWidth="1.8" fill="none" />
    </svg>
  ),
  react: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3.5"
        stroke="#61DAFB"
        strokeWidth="1.2"
        fill="none"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3.5"
        stroke="#61DAFB"
        strokeWidth="1.2"
        fill="none"
        transform="rotate(120 12 12)"
      />
    </svg>
  ),
  postgres: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="9" ry="9" fill="#336791" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontFamily="serif" fontWeight="700" fill="#fff">
        P
      </text>
    </svg>
  ),
  ts: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" fill="#3178C6" />
      <text x="12" y="17" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fontWeight="700" fill="#fff">
        TS
      </text>
    </svg>
  ),
  rag: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="6" cy="12" r="3" fill="#7C5CC0" />
      <circle cx="18" cy="12" r="3" fill="#FCD34D" />
      <circle cx="12" cy="6" r="3" fill="#18D67E" />
      <path d="M6 12l6-6 6 6-6 6z" stroke="#1A1F2E" fill="none" />
    </svg>
  ),
  cv: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="#1A1F2E" />
      <circle cx="12" cy="12" r="6" fill="#FAF7EE" />
      <circle cx="12" cy="12" r="3" fill="#2563EB" />
      <circle cx="12" cy="12" r="1.2" fill="#1A1F2E" />
    </svg>
  ),
  qdrant: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M12 2l9 5v10l-9 5-9-5V7z" fill="#DC382D" />
      <path d="M12 7l4 2v6l-4 2-4-2V9z" fill="#fff" fillOpacity="0.6" />
    </svg>
  ),
  cpp: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M12 2l9 5v10l-9 5-9-5V7z" fill="#00599C" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fontFamily="sans-serif" fontWeight="700" fill="#fff">
        C++
      </text>
    </svg>
  ),
};

/* =========================================================================
   UFO — pixel saucer with dome window. The glow beam is added in CSS
   (gradient cone) so we keep the sprite small + crispy.
   ========================================================================= */
const UFO_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  S: '#9CA3B0', // saucer body (steel)
  s: '#5C6173', // saucer shade
  C: '#62B6CB', // dome glass
  c: '#2A8AA8', // dome shade
  W: '#FAF7EE', // window highlight
  Y: '#FCD34D', // rim light
  y: '#E89215', // rim light dim
  G: '#18D67E', // accent led
};
const UFO = [
  '.......OOOOOO.......',
  '......OCCWWCCO......',
  '.....OcCCWWCCcO.....',
  '....OOccCCCCccOO....',
  '.OOOOOOOSSSSSSSOOOOO',
  'OSSSSSSSSSSSSSSSSSSO',
  'OYyGyYyGyYyGyYyGyYyO',
  '.OOOOOOOOOOOOOOOOOO.',
  '...OOOOOOOOOOOOOO...',
];
export function Ufo({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={UFO} palette={UFO_PAL} scale={scale} />;
}

/* =========================================================================
   Delivery drone — quadcopter with a tiny package dangling underneath.
   ========================================================================= */
const DRONE_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  S: '#5C6173', // arms
  R: '#1A1F2E', // rotors (blurred via CSS)
  B: '#2E3445', // body
  L: '#18D67E', // led
  W: '#FAF7EE',
  P: '#8C6B4F', // package brown
  p: '#6E4F38',
};
const DRONE = [
  'OO.......OO',
  'ORO.....ORO',
  'OOOOOOOOOOO',
  '...OOOOO...',
  '..OBBLBBO..',
  '..OBBWBBO..',
  '..OBBBBBO..',
  '...OOOOO...',
  '....O.O....',
  '...OPpPO...',
  '...OPpPO...',
  '...OOOOO...',
];
export function Drone({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={DRONE} palette={DRONE_PAL} scale={scale} />;
}

/* =========================================================================
   Pixel Robot — two frames (idle / walk). Used pacing on a side ledge.
   ========================================================================= */
const ROBOT_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  S: '#9CA3B0', // chassis
  s: '#5C6173', // chassis shade
  G: '#18D67E', // power led
  W: '#FAF7EE', // eye lens
  B: '#2563EB', // chest panel
  Y: '#FCD34D', // antenna bulb
};
const ROBOT_A = [
  '....OO....',
  '....OYO...',
  '..OOOOOO..',
  '.OSSSSSSO.',
  '.OWWOWWWO.',
  '.OSSSSSSO.',
  '..OOOOOO..',
  '.OSBBBBSO.',
  'OSSBGBBSSO',
  'OSSBBBBSSO',
  '.OssssssO.',
  '..OOOOOO..',
  '..O....O..',
  '..O....O..',
  '..OO..OO..',
];
const ROBOT_B = [
  '....OO....',
  '....OYO...',
  '..OOOOOO..',
  '.OSSSSSSO.',
  '.OWWWOWWO.',
  '.OSSSSSSO.',
  '..OOOOOO..',
  '.OSBBBBSO.',
  'OSSBGBBSSO',
  'OSSBBBBSSO',
  '.OssssssO.',
  '..OOOOOO..',
  '..O....O..',
  '.OO....OO.',
  'OO......OO',
];
export function Robot({ frame = 0, scale = 2 }: { frame?: number; scale?: number }) {
  return <PixelArt rows={frame === 0 ? ROBOT_A : ROBOT_B} palette={ROBOT_PAL} scale={scale} />;
}

/* =========================================================================
   Paper plane — pixel-art origami plane. Tows a banner via CSS (like the
   blimp) so it can carry section-specific text payloads.
   ========================================================================= */
const PAPERPLANE_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  W: '#FAF7EE',
  S: '#D6CFBE',
};
const PAPERPLANE = [
  '...OO.........',
  '..OWWOO.......',
  '.OWWWWWOO.....',
  'OWWWWWWWWWOO..',
  'OWWWWWSSSSSWOO',
  'OWWWSSOOOOOOO.',
  'OWSSOO........',
  'OSOO..........',
  'OO............',
];
export function PaperPlane({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={PAPERPLANE} palette={PAPERPLANE_PAL} scale={scale} />;
}

/* =========================================================================
   Envelope — pixel-art mail used by the Contact section delivery animation.
   ========================================================================= */
const ENVELOPE_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  W: '#FAF7EE',
  X: '#C9342B',
  S: '#FCD34D',
};
const ENVELOPE = [
  'OOOOOOOOOOOO',
  'OWWWWWWWWWWO',
  'OWXWWWWWWXWO',
  'OWWXWWWWXWWO',
  'OWWWXWWXWWWO',
  'OWWWWXXWWWWO',
  'OWWWWXXWWWWO',
  'OWWWXSSXWWWO',
  'OWWWWSSWWWWO',
  'OWWWWWWWWWWO',
  'OOOOOOOOOOOO',
];
export function Envelope({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={ENVELOPE} palette={ENVELOPE_PAL} scale={scale} />;
}

/* =========================================================================
   GradCap — pixel-art mortarboard with tassel.
   ========================================================================= */
const GRADCAP_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  B: '#1A1F2E', // mortarboard
  b: '#2E3445', // mortarboard shade
  G: '#2D8954', // MSU green
  R: '#C9342B', // tassel rope
  Y: '#FCD34D', // tassel head
  W: '#FAF7EE',
};
const GRADCAP = [
  '..............OO..........',
  '..OOOOOOOOOOOOOO..........',
  '.OBbBbBbBbBbBbBBOO........',
  'OBBBBBBBBBBBBBBBBBO.......',
  '.OOOOOOOOOOOOOOOOO........',
  '....OBBBBBBBBBBBO.........',
  '....OBbbbbbbbbbBO.........',
  '....OOOOOOOOOOOO..........',
  '..............O...........',
  '..............ORR.........',
  '..............OYY.........',
  '..............OYY.........',
  '..............OYY.........',
];
export function GradCap({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={GRADCAP} palette={GRADCAP_PAL} scale={scale} />;
}

/* =========================================================================
   Diploma — rolled parchment scroll tied with a green ribbon.
   ========================================================================= */
const DIPLOMA_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  W: '#FAF7EE', // parchment
  w: '#E0D9C2', // parchment shade
  T: '#8C6B4F', // scroll edge wood
  G: '#2D8954', // ribbon green
  g: '#1B5C36',
  S: '#1A1F2E', // calligraphy
};
const DIPLOMA = [
  '.OOOOOOOOOOOOOOOOOOOOOOO.',
  'OTTTTOOOOOOOOOOOOOOOOTTTO',
  'OTwwTOWWWWWWWWWWWWWWOTwwT',
  'OTwwTOWWSSSSSSSSSSWWOTwwO',
  'OTwwTOWWWWWWWWWWWWWWOTwwT',
  'OTwwTOWWSSSSSWWWWWWWOTwwO',
  'OTwwTOWWWWWWWWWWWWWWOTwwT',
  'OTwwTOWWWWWWWSSWWWWWOTwwO',
  'OTwwTOWWWWWWWWWWWWWWOTwwT',
  'OTTTTOOOOOOOOOOOOOOOOTTTO',
  '.OOOOOOOOOOOOOOOOOOOOOOO.',
  '........OOOOOOOOO........',
  '.......OGGGGGGGGGO.......',
  '......OGggggggggggO......',
  '......OGGGGGGGGGGGO......',
  '.......OOOOOOOOOOO.......',
];
export function Diploma({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={DIPLOMA} palette={DIPLOMA_PAL} scale={scale} />;
}

/* =========================================================================
   Medal — circular pixel award hanging from a ribbon.
   ========================================================================= */
const MEDAL_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  R: '#C9342B',
  r: '#8E2018',
  Y: '#FCD34D',
  G: '#E89215',
  W: '#FAF7EE',
  S: '#1A1F2E',
};
const MEDAL = [
  '..ORRRRRRRRO..',
  '..OrRRRRRRrO..',
  '..ORRRRRRRRO..',
  '..OOOOOOOOOO..',
  '.OYYYYYYYYYYO.',
  'OYGGGGGGGGGGYO',
  'OYGYYYYYYYYGYO',
  'OYGYWWWWWWYGYO',
  'OYGYWSSSSWYGYO',
  'OYGYWSWWSWYGYO',
  'OYGYWSSSSWYGYO',
  'OYGYWWWWWWYGYO',
  'OYGYYYYYYYYGYO',
  'OYGGGGGGGGGGYO',
  '.OYYYYYYYYYYO.',
  '..OOOOOOOOOO..',
];
export function Medal({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={MEDAL} palette={MEDAL_PAL} scale={scale} />;
}

/* =========================================================================
   AI Chip — small neural-net circuit sprite for the terminal corner.
   ========================================================================= */
const CHIP_PAL: Palette = {
  '.': 'transparent',
  O: '#0A0E1A',
  G: '#18D67E', // phosphor green traces
  g: '#0E6B40',
  N: '#FCD34D', // active node
  D: '#1A4458', // chip core
  S: '#2E3445', // chip body
};
const CHIP = [
  '..O..O..O..O..',
  '..O..O..O..O..',
  'OOOOOOOOOOOOOO',
  'OSSSSSSSSSSSSO',
  'OSgNgGgGgNgSO.',
  'OSGgDDDDDDgSO.',
  'OSGgDNGNDgGSO.',
  'OSGgDGGGDgGSO.',
  'OSGgDNGNDgGSO.',
  'OSGgDDDDDDgSO.',
  'OSgNgGgGgNgSO.',
  'OSSSSSSSSSSSSO',
  'OOOOOOOOOOOOOO',
  '..O..O..O..O..',
  '..O..O..O..O..',
];
export function AiChip({ scale = 2 }: { scale?: number }) {
  return <PixelArt rows={CHIP} palette={CHIP_PAL} scale={scale} />;
}
