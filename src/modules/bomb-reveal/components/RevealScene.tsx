import { motion } from 'motion/react';
import { Bomb, Heart } from 'lucide-react';
import HeartCanvas from './HeartCanvas';
import { useLanguage } from '../hooks/useLanguage';

interface RevealSceneProps {
  onReArm: () => void;
}

/** Stage 3 — the heart that the blast assembled, with the Valentine's Day message. */
export default function RevealScene({ onReArm }: RevealSceneProps) {
  const { t } = useLanguage();
  const reveal = t.reveal;

  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <HeartCanvas phrases={reveal.heartPhrases} />

      {/* top: Valentine's Day headline (above the heart) — width-capped and
          centered so the long copy never reaches the corner overlays. */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute left-1/2 top-[7%] z-20 w-[88%] max-w-xl -translate-x-1/2 px-2 text-center md:top-[6%]"
      >
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-pink-soft/50 md:mb-3 md:text-[10px] md:tracking-[0.5em]">
          {reveal.tag}
        </p>
        <h1 className="font-stencil glow-text-strong text-2xl uppercase leading-tight text-pink-deep md:text-5xl">
          {reveal.topLine}
        </h1>
      </motion.div>

      {/* her name, right in the middle of the heart */}
      <motion.p
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1, 1.05, 1], opacity: 1 }}
        transition={{
          opacity: { delay: 2.2, duration: 1 },
          scale: { delay: 2.2, duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="font-script glow-text-strong absolute left-1/2 top-[44%] z-20 -translate-x-1/2 -translate-y-1/2 text-6xl text-white md:text-7xl"
      >
        {reveal.topName}
      </motion.p>

      {/* bottom: the bomb-girl line (below the heart, never covering it) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-[6%] z-20 flex flex-col items-center text-center"
      >
        <p className="flex items-center gap-3 font-stencil text-xl uppercase tracking-[0.15em] text-pink-soft md:text-3xl">
          <Bomb size={22} className="text-brand-red" />
          {reveal.bottomLine}
          <Bomb size={22} className="text-brand-red" />
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">
          {reveal.bottomSub}
        </p>
        <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-pink-soft/80">
          <Heart size={12} className="text-brand-red" />
          {reveal.denjiHeart}
          <Heart size={12} className="text-brand-red" />
        </p>

        <motion.button
          onClick={onReArm}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="mt-7 font-mono text-[10px] uppercase tracking-[0.35em] text-white/25 transition-colors hover:text-pink-deep"
        >
          {reveal.replay}
        </motion.button>
      </motion.div>

      {/* tech overlays — Chainsaw Man / Reze flavor. Hidden on phones so they
          never collide with the centered headline / tag. */}
      <div className="absolute left-8 top-8 z-20 hidden space-y-1 font-mono text-[10px] uppercase tracking-widest text-white/15 md:block">
        {reveal.overlays.topLeft.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div className="absolute bottom-8 right-8 z-20 font-mono text-[10px] uppercase tracking-widest text-white/15">
        {reveal.overlays.bottomRight}
      </div>
    </motion.div>
  );
}
