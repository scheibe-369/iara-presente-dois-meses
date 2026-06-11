import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import AmbientEmbers from './components/AmbientEmbers';
import IntroTerminal from './components/IntroTerminal';
import DetonationSequence from './components/DetonationSequence';
import RevealScene from './components/RevealScene';
import LanguageToggle from './components/LanguageToggle';
import { LanguageProvider } from './hooks/useLanguage';

type Stage = 'intro' | 'detonation' | 'reveal';

const pageFromHash = (): 'intro' | 'reveal' =>
  window.location.hash === '#reveal' ? 'reveal' : 'intro';

/**
 * Orchestrates the three-act Bomb Devil reveal:
 * intro terminal → detonation → beating heart with the Valentine's Day note.
 *
 * The intro and the reveal are distinct browser-history entries, so the back
 * button returns to the intro. Advancing only happens via "Detonate message".
 */
export default function BombReveal() {
  const [stage, setStage] = useState<Stage>(() => pageFromHash());

  // Keep React state in sync with browser navigation (back / forward buttons).
  useEffect(() => {
    window.history.replaceState({ page: pageFromHash() }, '');
    const onPop = () => setStage(pageFromHash()); // history nav skips the animation
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const detonate = useCallback(() => {
    window.history.pushState({ page: 'reveal' }, '', '#reveal');
    setStage('detonation');
  }, []);

  const reArm = useCallback(() => {
    // step back to the intro history entry the reveal was pushed on top of
    if (window.history.state?.page === 'reveal') {
      window.history.back();
    } else {
      window.history.pushState({ page: 'intro' }, '', '#');
      setStage('intro');
    }
  }, []);

  return (
    <LanguageProvider>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050505]">
        <div className="scanline" />
        <div className="vignette" />
        <AmbientEmbers />
        <LanguageToggle />

        <AnimatePresence mode="wait">
          {stage === 'intro' && <IntroTerminal key="intro" onDetonate={detonate} />}
          {stage === 'detonation' && (
            <DetonationSequence key="detonation" onDone={() => setStage('reveal')} />
          )}
          {stage === 'reveal' && <RevealScene key="reveal" onReArm={reArm} />}
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
}
