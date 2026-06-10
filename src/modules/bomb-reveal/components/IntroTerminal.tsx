import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bomb, Radio } from 'lucide-react';
import Typewriter from './Typewriter';
import { useLanguage } from '../hooks/useLanguage';

interface IntroTerminalProps {
  onDetonate: () => void;
}

/** Stage 1 — a romantic "armed bomb" terminal. */
export default function IntroTerminal({ onDetonate }: IntroTerminalProps) {
  const { lang, t } = useLanguage();
  const intro = t.intro;

  // sequential reveal: 0 boot → 1 meta+line0 → 2 line1 → 3 ready (both lines typed)
  const [step, setStep] = useState(0);
  const next = useCallback(() => setStep((s) => s + 1), []);
  const ready = step >= 3;

  // switching language replays the terminal from scratch in the new language
  useEffect(() => setStep(0), [lang]);

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.04 }}
      transition={{ duration: 0.5 }}
      className="relative z-20 w-full max-w-2xl p-8 font-mono text-sm text-white/80 md:text-base"
    >
      {/* armed badge */}
      <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-pink-deep/70">
        <Radio size={14} className="animate-pulse" />
        <span>{intro.terminalLabel}</span>
        <motion.span
          className="ml-auto flex items-center gap-2 text-brand-red"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        >
          <span className="h-2 w-2 rounded-full bg-brand-red shadow-[0_0_10px_#ff003c]" />
          {intro.armedLabel}
        </motion.span>
      </div>

      {/* keyed by lang so the typewriter replays cleanly on a language switch */}
      <div key={lang} className="space-y-2">
        <div className="flex flex-wrap gap-2 text-pink-soft/70">
          <span>[{intro.systemLabel}]</span>
          <Typewriter text={intro.bootLine} delay={26} onComplete={next} />
        </div>

        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <span className="text-white/40">[{intro.targetLabel}]</span>
              <span className="text-pink-deep glow-text">{intro.targetValue}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-white/40">[{intro.statusLabel}]</span>
              <span className="text-spark">{intro.statusValue}</span>
            </div>
          </motion.div>
        )}

        {step >= 1 && (
          <div className="pt-6 flex flex-col items-start gap-2 text-white/45 italic">
            <span>
              {'> '}
              <Typewriter text={intro.lines[0]} startDelay={350} delay={24} onComplete={next} />
            </span>
            {step >= 2 && (
              <span>
                {'> '}
                <Typewriter text={intro.lines[1]} startDelay={150} delay={24} onComplete={next} />
              </span>
            )}
          </div>
        )}

        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-10 flex flex-col items-start gap-5"
          >
            {/* charge bar */}
            <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-deep via-brand-red to-spark"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
            </div>

            <motion.button
              id="decrypt-button"
              onClick={onDetonate}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative flex items-center gap-3 overflow-hidden border border-brand-red/40 bg-brand-red/10 px-7 py-3.5 text-brand-red transition-colors hover:bg-brand-red/20"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Bomb size={18} className="transition-transform group-hover:rotate-12" />
              <span className="font-mono text-xs uppercase tracking-[0.3em]">{intro.cta}</span>
              <span className="terminal-cursor" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
