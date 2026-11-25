'use client';

import { Download, ExternalLink } from "lucide-react";
import { useLanguage } from "../../_context/LanguageContext";
import { CV_LINKS } from "../../_lib/links";

const action =
  "flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/20 active:bg-white/30";

/** Botón doble del CV: ver en línea o descargar, en el idioma activo. */
export function CvPill({ className = "" }: { className?: string }) {
  const { t, locale } = useLanguage();
  const links = CV_LINKS[locale];

  return (
    <div
      className={`inline-flex items-center justify-center gap-1 rounded-full bg-linear-to-r from-primary-dark to-primary py-1 pl-6 pr-2 text-primary-foreground shadow-lg ${className}`}
    >
      <span className="mr-1 text-base font-semibold uppercase tracking-wider">{t("cv.label")}</span>
      <a
        href={links.preview}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("cv.preview")}
        title={t("cv.preview")}
        className={action}
      >
        <ExternalLink size={18} aria-hidden />
      </a>
      <span aria-hidden className="h-5 w-px bg-white/35" />
      <a
        href={links.download}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("cv.download")}
        title={t("cv.download")}
        className={action}
      >
        <Download size={18} aria-hidden />
      </a>
    </div>
  );
}
