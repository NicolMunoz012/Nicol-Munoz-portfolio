'use client';

import { useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconButton } from "../ui/IconButton";
import { useLanguage } from "../../_context/LanguageContext";

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  // Comentario: Menú de configuración que agrupa tema e idioma.
  return (
    <div className="relative">
      <IconButton
        label={t("nav.settings")}
        onClick={() => setOpen((prev) => !prev)}
        className={`gap-2 ${
          open ? "border-accent/60 bg-accent/10" : ""
        }`}
        icon={
          <span className="flex items-center gap-1 text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(244,114,182,0.9)] dark:bg-rose-300" />
            <span>⚙</span>
            <span className="hidden sm:inline">{t("nav.settings")}</span>
          </span>
        }
      />
      {open ? (
        <div className="absolute right-0 z-20 mt-3 w-72 origin-top-right rounded-2xl border border-border/70 bg-surface/85 p-4 text-xs shadow-xl backdrop-blur-lg">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                {t("settings.title")}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] text-muted underline-offset-2 hover:underline"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  );
}

