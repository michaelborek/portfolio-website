'use client';

import { useEffect, useRef } from 'react';

const GLYPHS =
  'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF<>{}[]()/\\|=+*-';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let drops: number[] = [];
    let cols = 0;
    let cellW = 0;
    let cellH = 0;
    let dpr = 1;
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const fontPx = isMobile ? 12 : 14;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      cellW = fontPx;
      cellH = fontPx + 2;
      cols = Math.ceil(w / cellW);
      drops = new Array(cols)
        .fill(0)
        .map(() => Math.random() * (h / cellH));
    };

    resize();
    window.addEventListener('resize', resize);

    let last = 0;
    const frameInterval = isMobile ? 90 : 55;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < frameInterval) return;
      last = t;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.fillStyle = 'rgba(2, 6, 4, 0.16)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontPx}px ui-monospace, "Geist Mono", monospace`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const x = i * cellW;
        const y = drops[i] * cellH;

        // head — bright phosphor
        ctx.fillStyle = 'rgba(180, 255, 200, 0.95)';
        ctx.fillText(ch, x, y);

        // tail — older glyph dim green
        if (drops[i] > 1) {
          const ch2 = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          ctx.fillStyle = 'rgba(0, 220, 110, 0.55)';
          ctx.fillText(ch2, x, y - cellH);
        }

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
    };

    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden />;
}
