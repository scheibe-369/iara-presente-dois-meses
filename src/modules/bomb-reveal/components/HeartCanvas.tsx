import { useEffect, useRef } from 'react';

interface Point {
  // heart target
  tx: number;
  ty: number;
  // exploded start (debris flung out by the blast)
  sx: number;
  sy: number;
  alpha: number;
  targetAlpha: number;
  delay: number; // ms before this point starts converging
  phrase: string;
  width: number; // cached text width
  depth: number; // 0 (outer) .. 1 (inner/hot core)
  flick: number; // shimmer phase
}

// easeOutCubic — fast blast outward, gentle settle into the heart
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The reveal centerpiece: ~400 lines of "i love you" / "te amo" that are flung
 * out by the detonation and then converge into a heart which beats forever.
 */
export default function HeartCanvas({ phrases }: { phrases: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let points: Point[] = [];
    const fontSize = 14;
    const FORM_MS = 1500; // convergence duration per point
    const heartPhrases = phrases;

    const setFont = () => {
      ctx.font = `${fontSize}px "Fira Code", monospace`;
    };

    const heartAt = (t: number) => ({
      hx: 16 * Math.pow(Math.sin(t), 3),
      hy: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    });

    // heart sits a little above center so the headline and the bottom message
    // both have clear room without ever covering it
    const HEART_CY = 0.44;

    const initPoints = () => {
      points = [];
      setFont();
      const cx = canvas.width / 2;
      const cy = canvas.height * HEART_CY;
      const scale = Math.min(canvas.width, canvas.height) / 56;
      const blast = Math.max(canvas.width, canvas.height) * 0.9;

      const push = (hx: number, hy: number, depth: number, baseAlpha: number) => {
        const tx = cx + hx * scale;
        const ty = cy + hy * scale;
        // debris launched radially outward from the blast center
        const ang = Math.random() * Math.PI * 2;
        const dist = blast * (0.35 + Math.random() * 0.65);
        const phrase = heartPhrases[Math.floor(Math.random() * heartPhrases.length)];
        points.push({
          tx,
          ty,
          sx: cx + Math.cos(ang) * dist,
          sy: cy + Math.sin(ang) * dist,
          alpha: 0,
          targetAlpha: baseAlpha + Math.random() * 0.2,
          delay: Math.random() * 700,
          phrase,
          width: ctx.measureText(phrase).width,
          depth,
          flick: Math.random() * Math.PI * 2,
        });
      };

      // outline
      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const { hx, hy } = heartAt(t);
        push(hx, hy, 1, 0.8);
      }
      // inner layers (depth fades toward the rim) — start at 0.4 so the very
      // center stays open for her name
      for (let s = 0.4; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          const { hx, hy } = heartAt(t);
          push(hx * s, hy * s, s, 0.4);
        }
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    // lub-dub heartbeat → scale multiplier around the heart center
    const thump = (phase: number, at: number, w: number) => {
      const d = phase - at;
      if (d < 0) return 0;
      return Math.exp(-d / w);
    };
    const heartbeat = (tSec: number) => {
      const period = 1.15;
      const p = (tSec % period) / period;
      const b = thump(p, 0.0, 0.045) + 0.6 * thump(p, 0.16, 0.05);
      return 1 + b * 0.07; // up to ~7% swell
    };

    let start: number | null = null;
    const shockwaves: { r: number; alpha: number }[] = [];
    let lastBeatSlot = -1;

    const draw = (time: number) => {
      if (start === null) start = time;
      const elapsed = time - start;
      const tSec = elapsed / 1000;
      const cx = canvas.width / 2;
      const cy = canvas.height * HEART_CY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setFont();

      const beat = heartbeat(tSec);

      // emit a shockwave ring on the main thump of each beat
      const period = 1.15;
      const slot = Math.floor(tSec / period);
      if (slot !== lastBeatSlot && elapsed > FORM_MS) {
        lastBeatSlot = slot;
        shockwaves.push({ r: 10, alpha: 0.35 });
      }
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const w = shockwaves[i];
        w.r += 6;
        w.alpha -= 0.006;
        if (w.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 77, 109, ${w.alpha})`;
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, w.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const p of points) {
        // convergence: explode-in
        const local = Math.min(Math.max((elapsed - p.delay) / FORM_MS, 0), 1);
        const e = easeOut(local);
        const x = p.sx + (p.tx - p.sx) * e;
        const y = p.sy + (p.ty - p.sy) * e;

        // apply heartbeat swell around center once formed
        const bx = cx + (x - cx) * beat;
        const by = cy + (y - cy) * beat;

        if (local > 0) p.alpha += (p.targetAlpha - p.alpha) * 0.04;
        p.flick += 0.03;
        const shimmer = 0.85 + 0.15 * Math.sin(p.flick);
        const a = p.alpha * shimmer;

        // hot white core fading to deep pink at the rim
        const g = Math.floor(40 + (1 - p.depth) * 150);
        const b = Math.floor(80 + (1 - p.depth) * 120);
        ctx.fillStyle = `rgba(255, ${Math.min(g + 30, 230)}, ${Math.min(b + 20, 200)}, ${a})`;
        ctx.shadowBlur = p.depth > 0.85 ? 6 : 0;
        ctx.shadowColor = `rgba(255, 0, 60, ${a * 0.6})`;
        ctx.fillText(p.phrase, bx - p.width / 2, by);
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [phrases]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
      aria-hidden
    />
  );
}
