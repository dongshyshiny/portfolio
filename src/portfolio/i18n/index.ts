import React, { createContext, useContext, useState, useCallback } from 'react';
import { Translations, Locale } from './types';
import vi from './vi';
import en from './en';
import ko from './ko';

const translations: Record<Locale, Translations> = { vi, en, ko };

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  cycle: () => void;
}

const STORAGE_KEY = 'portfolio-locale';
const LOCALES: Locale[] = ['vi', 'en', 'ko'];
const LOCALE_LABELS: Record<Locale, string> = { vi: '🇻🇳 VI', en: '🇺🇸 EN', ko: '🇰🇷 KO' };

function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && LOCALES.includes(saved as Locale)) return saved as Locale;
  const lang = navigator.language.slice(0, 2);
  if (lang === 'vi') return 'vi';
  if (lang === 'ko') return 'ko';
  return 'en';
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  t: en,
  setLocale: () => {},
  cycle: () => {},
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const cycle = useCallback(() => {
    setLocaleState(prev => {
      const next = LOCALES[(LOCALES.indexOf(prev) + 1) % LOCALES.length];
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = translations[locale];

  return React.createElement(I18nContext.Provider, { value: { locale, t, setLocale, cycle } }, children);
};

export const useI18n = () => useContext(I18nContext);
export { LOCALE_LABELS, LOCALES };
export type { Locale, Translations };
