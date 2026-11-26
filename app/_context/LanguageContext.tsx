'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getTranslation,
  type SupportedLocale,
  type TranslationPath,
  locales,
} from "../_i18n";
import { LANGUAGE_STORAGE_KEY } from "../_lib/preferences";

type LanguageContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (path: TranslationPath) => string;
  availableLocales: SupportedLocale[];
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

// La fuente de verdad es el atributo `lang` de <html>, que el script de
// `preferences.ts` deja listo antes de hidratar.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readLocale(): SupportedLocale {
  return document.documentElement.lang === "en" ? "en" : "es";
}

function writeLocale(locale: SupportedLocale) {
  document.documentElement.lang = locale;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // Almacenamiento bloqueado: el idioma se aplica igual durante la sesión.
  }
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<SupportedLocale>(subscribe, readLocale, () => "es");

  const setLocale = useCallback((next: SupportedLocale) => writeLocale(next), []);

  const t = useCallback(
    (path: TranslationPath) => getTranslation(locale, path),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, availableLocales: locales }),
    [locale, setLocale, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
