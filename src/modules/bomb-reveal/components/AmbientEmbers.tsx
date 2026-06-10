import { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  vy: number;
  vx: number;
  r: number;
  alpha: number;
  hue: number;
  twinkle: number;
}

/**
 * Slow-rising glowing embers that live behind every stage to give the whole
 * scene a smoldering, post-detonation atmosphere.
 */
export default function AmbientEmbers({ count = 46 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let embers: Ember[] = [];

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const spawn = (atBottom: boolean): Ember => ({
      x: rand(0, canvas.width),
      y: atBottom ? canvas.height + rand(0, 40) : rand(0, canvas.height),
      vy: rand(-0.45, -0.12),
      vx: rand(-0.18, 0.18),
      r: rand(0.6, 2.4),
      alpha: rand(0.15, 0.7),
      hue: rand(340, 18), // pinks → reds → embers (wraps through 360)
      twinkle: rand(0, Math.PI * 2),
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      embers = Array.from({ length: count }, () => spawn(false));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const e of embers) {
        e.x += e.vx;
        e.y += e.vy;
        e.twinkle += 0.05;
        const flicker = 0.65 + 0.35 * Math.sin(e.twinkle);
        const a = e.alpha * flicker;

        ctx.beginPath();
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 60%, ${a})`;
        ctx.fillStyle = `hsla(${e.hue}, 100%, 70%, ${a})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();

        if (e.y < -10 || e.x < -10 || e.x > canvas.width + 10) {
          Object.assign(e, spawn(true));
        }
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
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
      aria-hidden
    />
  );
}
