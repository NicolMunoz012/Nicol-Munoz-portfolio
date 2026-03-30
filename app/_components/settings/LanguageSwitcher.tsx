'use client';

import { useLanguage } from "../../_context/LanguageContext";

export function LanguageSwitcher() {
  const { locale, setLocale, availableLocales, t } = useLanguage();

  // Comentario: Selector de idioma sencillo entre español e inglés.
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {t("settings.languageLabel")}
      </span>
      <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 p-1 text-xs shadow-sm">
        {availableLocales.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            className={`inline-flex min-w-[72px] items-center justify-center rounded-full px-3 py-1 font-medium transition-colors ${
              locale === item
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-surface-2/60"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

