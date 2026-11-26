'use client';

import type { RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Sun, Moon } from "lucide-react";
import { useLanguage } from "../../_context/LanguageContext";
import { useTheme } from "../../_context/ThemeContext";

interface NavbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}

const pill =
  "flex h-11 items-center justify-center rounded-full bg-primary-dark/80 text-white backdrop-blur-md transition-[background-color,scale] duration-150 hover:bg-primary-dark active:scale-95";

export function Navbar({ onMenuToggle, isMenuOpen, menuButtonRef }: NavbarProps) {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:h-20 lg:px-10">
        <Link
          href="/"
          aria-label={t("nav.home")}
          className="relative block h-14 w-14 overflow-hidden rounded-full"
        >
          <Image src="/logo.jpg" alt="" fill sizes="56px" className="object-cover" priority />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`${pill} w-11`}
            aria-label={theme === "dark" ? t("nav.switchToLight") : t("nav.switchToDark")}
          >
            {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
          </button>

          <button
            type="button"
            onClick={() => setLocale(locale === "es" ? "en" : "es")}
            className={`${pill} px-4 text-xs font-bold uppercase tracking-widest`}
            aria-label={t("nav.switchLanguage")}
          >
            <span aria-hidden>{locale.toUpperCase()}</span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenuToggle}
            aria-label={t("nav.openMenu")}
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            className={`${pill} group gap-2 px-1.5 text-xs font-bold uppercase tracking-widest sm:pl-4`}
          >
            <span className="hidden sm:inline" aria-hidden>
              {t("nav.menu")}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <Menu size={16} aria-hidden />
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
