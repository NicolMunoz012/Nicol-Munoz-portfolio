'use client';

import { useLanguage } from "../../_context/LanguageContext";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, ArrowUp } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      id="footer"
      className="relative mt-auto w-full border-t border-border/70 bg-surface py-10"
    >
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-center text-xs text-muted sm:text-left">
            © {new Date().getFullYear()} {t("nav.name")}. {t("footer.rights")}
          </p>
          <p className="text-center text-xs text-muted sm:text-left">
            {t("footer.madeWith")} <span className="text-accent/90"> ♥ </span>
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a href="#about" className="text-xs font-semibold text-muted-foreground hover:text-accent nav-link">
            {t("nav.about")}
          </a>
          <a href="#projects" className="text-xs font-semibold text-muted-foreground hover:text-accent nav-link">
            {t("nav.projects")}
          </a>
          <a href="#experience" className="text-xs font-semibold text-muted-foreground hover:text-accent nav-link">
            {t("nav.experience")}
          </a>
          <a href="#skills" className="text-xs font-semibold text-muted-foreground hover:text-accent nav-link">
            {t("sections.skills.title")}
          </a>
          <a href="#contact" className="text-xs font-semibold text-muted-foreground hover:text-accent nav-link">
            {t("nav.contact")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/NicolMunoz012"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/15 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-[#6D0B31]/30 hover:text-accent active:scale-95"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/nicol-mu%C3%B1oz-7b4b14307/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/15 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-[#6D0B31]/30 hover:text-accent active:scale-95"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="mailto:nicolmunoz004@gmail.com"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/15 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-[#6D0B31]/30 hover:text-accent active:scale-95"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/15 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-[#6D0B31]/30 hover:text-accent active:scale-95"
            aria-label={t("footer.backToTop")}
            title={t("footer.backToTop")}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
