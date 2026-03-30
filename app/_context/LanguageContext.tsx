'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getTranslation,
  type SupportedLocale,
  type TranslationPath,
  locales,
} from "../_i18n";

type LanguageContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (path: TranslationPath) => string;
  availableLocales: SupportedLocale[];
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "portfolio-language";

function getInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") return "es";

  const stored = window.localStorage.getItem(STORAGE_KEY) as
    | SupportedLocale
    | null;

  if (stored && locales.includes(stored)) return stored;

  const browserLanguage =
    typeof navigator !== "undefined" ? navigator.language : "es";
  const baseLanguage = browserLanguage.split("-")[0] as SupportedLocale;

  return locales.includes(baseLanguage) ? baseLanguage : "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(getInitialLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (path: TranslationPath) => getTranslation(locale, path),
    [locale],
  );

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t, availableLocales: locales }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}

