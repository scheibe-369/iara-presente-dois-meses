import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  startDelay?: number;
  onComplete?: () => void;
  className?: string;
}

/** Character-by-character terminal typing effect. */
export default function Typewriter({
  text,
  delay = 38,
  startDelay = 0,
  onComplete,
  className,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [armed, setArmed] = useState(startDelay === 0);

  useEffect(() => {
    if (armed) return;
    const t = setTimeout(() => setArmed(true), startDelay);
    return () => clearTimeout(t);
  }, [armed, startDelay]);

  useEffect(() => {
    if (!armed) return;
    if (index < text.length) {
      const t = setTimeout(() => setIndex((i) => i + 1), delay);
      return () => clearTimeout(t);
    }
    onComplete?.();
  }, [armed, index, text, delay, onComplete]);

  return <span className={className}>{text.slice(0, index)}</span>;
}
