'use client';

import { useTheme } from "../../_context/ThemeContext";
import { useLanguage } from "../../_context/LanguageContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  // Comentario: Selector de tema con dos opciones: claro y oscuro.
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {t("settings.themeLabel")}
      </span>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left text-xs transition-colors btn-ghost ${
            theme === "light"
              ? "border-accent/60 bg-accent/10 text-foreground shadow-sm"
              : "border-border/70 bg-surface/40 text-muted-foreground hover:border-accent/30 hover:bg-accent/5"
          }`}
        >
          <span className="text-[11px] font-semibold">
            {t("settings.theme.light")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left text-xs transition-colors btn-ghost ${
            theme === "dark"
              ? "border-accent/60 bg-accent/10 text-foreground shadow-sm"
              : "border-border/70 bg-surface/40 text-muted-foreground hover:border-accent/30 hover:bg-accent/5"
          }`}
        >
          <span className="text-[11px] font-semibold">
            {t("settings.theme.dark")}
          </span>
        </button>
      </div>
    </div>
  );
}

