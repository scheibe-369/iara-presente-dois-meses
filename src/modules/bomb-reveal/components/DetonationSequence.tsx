import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';

interface DetonationSequenceProps {
  onDone: () => void;
}

type Phase = 'arm' | 'pull' | 'fuse' | 'count' | 'flash';

// shake keyframes per phase — jitter grows as the fuse burns toward zero
const SHAKE: Record<Phase, { x: number[]; y: number[]; dur: number }> = {
  arm: { x: [0], y: [0], dur: 0.2 },
  pull: { x: [0, -1, 1, 0], y: [0, 1, -1, 0], dur: 0.3 },
  fuse: { x: [0, -2, 2, -1, 1, 0], y: [0, 1, -2, 2, -1, 0], dur: 0.35 },
  count: { x: [0, -5, 5, -4, 4, 0], y: [0, 4, -5, 3, -3, 0], dur: 0.18 },
  flash: { x: [0, -14, 14, -10, 10, -6, 0], y: [0, 12, -14, 8, -8, 4, 0], dur: 0.12 },
};

const FUSE_PATH = 'M 170 28 Q 150 72 110 118';

// Pacing (ms). Kept deliberately unhurried so the 3·2·1 reads clearly.
const FUSE_BURN = 1900; // fuse travel time
const T_PULL = 450;
const T_FUSE = 1000;
const T_COUNT = T_FUSE + FUSE_BURN; // first digit appears when the fuse hits the bomb
const STEP = 850; // gap between digits
const T_FLASH = T_COUNT + STEP * 3;
const T_DONE = T_FLASH + 550;

/** Stage 2 — Reze pulls the pin and the message detonates. */
export default function DetonationSequence({ onDone }: DetonationSequenceProps) {
  const { t } = useLanguage();
  const detonation = t.detonation;
  const [phase, setPhase] = useState<Phase>('arm');
  const [count, setCount] = useState(-1);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    at(T_PULL, () => setPhase('pull'));
    at(T_FUSE, () => setPhase('fuse'));
    at(T_COUNT, () => {
      setPhase('count');
      setCount(0);
    });
    at(T_COUNT + STEP, () => setCount(1));
    at(T_COUNT + STEP * 2, () => setCount(2));
    at(T_FLASH, () => {
      setPhase('flash');
      setCount(-1);
    });
    at(T_DONE, onDone);

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const shake = SHAKE[phase];

  return (
    <motion.div
      key="detonation"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-20 flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ x: shake.x, y: shake.y }}
        transition={{ duration: shake.dur, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* The bomb */}
        <AnimatePresence>
          {(phase === 'arm' || phase === 'pull' || phase === 'fuse') && (
            <motion.div
              key="bomb"
              initial={{ scale: 0, y: -60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className="relative"
              style={{ width: 220, height: 260 }}
            >
              {/* fuse */}
              <svg
                viewBox="0 0 220 260"
                width={220}
                height={260}
                className="absolute inset-0"
                fill="none"
              >
                <path d={FUSE_PATH} stroke="#5a4631" strokeWidth={5} strokeLinecap="round" />
                {phase === 'fuse' && (
                  <motion.path
                    d={FUSE_PATH}
                    stroke="#ff6b35"
                    strokeWidth={5}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -1 }}
                    transition={{ duration: FUSE_BURN / 1000, ease: 'linear' }}
                  />
                )}
              </svg>

              {/* travelling spark */}
              {phase === 'fuse' && (
                <motion.div
                  className="absolute left-0 top-0 h-3 w-3 rounded-full bg-spark shadow-[0_0_16px_6px_#ffcf5c]"
                  style={{ offsetPath: `path('${FUSE_PATH}')`, offsetRotate: '0deg' }}
                  initial={{ offsetDistance: '0%' }}
                  animate={{ offsetDistance: '100%', scale: [1, 1.4, 1] }}
                  transition={{
                    offsetDistance: { duration: FUSE_BURN / 1000, ease: 'linear' },
                    scale: { duration: 0.25, repeat: Infinity },
                  }}
                />
              )}

              {/* bomb body */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ bottom: 18, width: 124, height: 124 }}
              >
                {/* neck */}
                <div className="absolute -top-3 left-1/2 h-5 w-7 -translate-x-1/2 rounded-sm bg-[#1a1a1a]" />
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, #4a4a4a 0%, #1a1a1a 45%, #050505 100%)',
                    boxShadow:
                      '0 0 50px rgba(255,0,60,0.25), inset -8px -8px 20px rgba(0,0,0,0.8), inset 6px 6px 16px rgba(255,255,255,0.06)',
                  }}
                />
                {/* glossy highlight */}
                <div className="absolute left-[26%] top-[22%] h-5 w-5 rounded-full bg-white/30 blur-[2px]" />
              </div>

              {/* the pin + ring (Reze yanks it out) */}
              <motion.div
                className="absolute"
                style={{ left: 150, top: 96 }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={
                  phase === 'arm'
                    ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                    : { x: 120, y: -90, rotate: 220, opacity: 0 }
                }
                transition={{ duration: 0.5, ease: 'easeIn' }}
              >
                <svg width={44} height={32} viewBox="0 0 44 32" fill="none">
                  <circle cx="14" cy="16" r="11" stroke="#c9a227" strokeWidth="4" />
                  <rect x="24" y="14" width="18" height="4" rx="2" fill="#c9a227" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* pin hint */}
        <AnimatePresence>
          {phase === 'pull' && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-16 font-mono text-xs uppercase tracking-[0.35em] text-spark/70"
            >
              {detonation.pinHint}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* countdown — its own full-screen centered layer so it is always visible.
          Sync mode (no mode="wait") so each number mounts immediately on its
          tick: a slow exit must never swallow the next digit (that ate the "2"). */}
      <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
        <AnimatePresence>
          {count >= 0 && (
            <motion.span
              key={count}
              initial={{ scale: 2.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 18 } }}
              exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.18 } }}
              className="font-stencil glow-text-strong col-start-1 row-start-1 text-[10rem] leading-none text-brand-red md:text-[14rem]"
            >
              {detonation.countdown[count]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* shockwave rings */}
      {phase === 'flash' &&
        [0, 0.12, 0.24].map((d, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute rounded-full border-2 border-pink-deep"
            initial={{ width: 40, height: 40, opacity: 0.7 }}
            animate={{ width: 1800, height: 1800, opacity: 0 }}
            transition={{ duration: 0.9, delay: d, ease: 'easeOut' }}
          />
        ))}

      {/* white flash */}
      {phase === 'flash' && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.3, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut', times: [0, 0.12, 0.4, 1] }}
        />
      )}
    </motion.div>
  );
}
