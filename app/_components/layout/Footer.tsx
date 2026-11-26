'use client';

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, ArrowUp } from "lucide-react";
import { useLanguage } from "../../_context/LanguageContext";
import { SOCIAL_LINKS } from "../../_lib/links";

const NAV_LINKS = [
  { href: "#about", key: "nav.about" },
  { href: "#projects", key: "nav.projects" },
  { href: "#experience", key: "nav.experience" },
  { href: "#skills", key: "sections.skills.title" },
  { href: "#contact", key: "nav.contact" },
] as const;

const iconLink =
  "inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-dark/15 text-foreground transition-colors hover:bg-primary-dark/30 hover:text-accent active:scale-95";

export function Footer() {
  const { t } = useLanguage();

  return (
    // pb-24: deja libre la esquina donde flota el reproductor.
    <footer id="footer" className="relative mt-auto w-full border-t border-primary-dark/30 pb-24 pt-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-1 text-xs text-muted sm:items-start">
          <p>
            © {new Date().getFullYear()} {t("nav.name")}. {t("footer.rights")}
          </p>
          <p>
            {t("footer.madeWith")} <span className="text-accent" aria-hidden>♥</span>
          </p>
        </div>

        <nav aria-label={t("nav.menu")} className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-accent"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub">
            <FaGithub size={18} aria-hidden />
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn">
            <FaLinkedin size={18} aria-hidden />
          </a>
          <a href={SOCIAL_LINKS.email} className={iconLink} aria-label="Email">
            <Mail size={18} aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
            className={iconLink}
            aria-label={t("footer.backToTop")}
          >
            <ArrowUp size={18} aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  );
}
