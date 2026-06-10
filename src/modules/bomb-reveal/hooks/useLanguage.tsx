import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { copy, DEFAULT_LANG, type Copy, type Lang } from '../data/copy';

const STORAGE_KEY = 'heart-lang';

interface LanguageValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Copy;
}

const LanguageContext = createContext<LanguageValue | null>(null);

const readInitial = (): Lang => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pt') return saved;
  } catch {
    /* ignore unavailable storage */
  }
  return DEFAULT_LANG;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  // keep the document in sync with the chosen language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = copy[lang].pageTitle;
  }, [lang]);

  const value = useMemo<LanguageValue>(() => ({ lang, setLang, t: copy[lang] }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
