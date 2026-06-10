import { Globe } from 'lucide-react';
import { LANGUAGES } from '../data/copy';
import { useLanguage } from '../hooks/useLanguage';

/** Small PT / EN segmented switch, pinned top-right across every stage. */
export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed right-4 top-4 z-40 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
      <Globe size={12} className="text-white/30" />
      <div className="flex items-center gap-1">
        {LANGUAGES.map(({ code, label }, i) => (
          <span key={code} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/20">/</span>}
            <button
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={`transition-colors ${
                lang === code
                  ? 'text-brand-red glow-text'
                  : 'text-white/30 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
