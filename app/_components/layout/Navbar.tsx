'use client';

import { useLanguage } from "../../_context/LanguageContext";
import { useTheme } from "../../_context/ThemeContext";
import { Menu, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function Navbar({ onMenuToggle, isMenuOpen }: NavbarProps) {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:h-20 lg:px-10">
        {/* Logo izquierdo */}
        <div className="flex items-center">
          <div className="relative h-14 w-14 overflow-hidden rounded-full">
            <img
              src="/logo.jpg"
              alt="Nicol Muñoz"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Menu Toggle + Theme + Language */}
        <div className="flex items-center gap-3">
          {/* Botón de Tema */}
          <motion.button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/60 text-white backdrop-blur-md transition-all hover:bg-[#6D0B31]/80 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* Botón de Idioma */}
          <motion.button
            onClick={() => setLocale(locale === "es" ? "en" : "es")}
            className="flex h-10 items-center justify-center rounded-full bg-[#6D0B31]/60 px-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-[#6D0B31]/80 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle language"
          >
            {locale === "es" ? "ES" : "EN"}
          </motion.button>

          {/* Botón de Menú */}
          <button
            onClick={onMenuToggle}
            className={`group flex items-center gap-3 rounded-full bg-[#6D0B31]/60 py-2 pl-4 pr-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-[#6D0B31]/80 active:scale-95 ${
              isMenuOpen ? "bg-[#6D0B31]/75" : ""
            }`}
          >
            <span>{t("nav.menu") || "Menu"}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground group-hover:scale-110 transition-transform">
              <Menu size={16} />
            </div>
          </button>
        </div>
      </nav>
    </header>
  );
}
