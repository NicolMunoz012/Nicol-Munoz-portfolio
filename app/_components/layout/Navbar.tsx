'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../_context/LanguageContext";
import { useScrollDirection } from "../../_hooks/useScrollDirection";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function Navbar({ onMenuToggle, isMenuOpen }: NavbarProps) {
  const { t } = useLanguage();
  const scrollDirection = useScrollDirection({ threshold: 10 });

  const isHidden = scrollDirection === "down" && !isMenuOpen;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("portfolio:navbar-visibility", {
        detail: { hidden: isHidden },
      }),
    );
  }, [isHidden]);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-30 will-change-transform"
      initial={false}
      animate={{ y: isHidden ? -120 : 0, opacity: isHidden ? 0.98 : 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.8 }}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:h-20 lg:px-10">
        {/* Logo izquierdo */}
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground shadow-lg">
            NM
          </div>
        </div>

        {/* Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className={`group flex items-center gap-3 rounded-full bg-surface-2/80 py-2 pl-4 pr-2 text-xs font-bold uppercase tracking-widest text-foreground backdrop-blur-md transition-all hover:bg-accent/10 hover:text-accent border ${
              isMenuOpen ? "border-transparent" : "border-accent/25"
            }`}
          >
            <span>{t("nav.menu") || "Menu"}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground group-hover:scale-110 transition-transform">
              <Menu size={16} />
            </div>
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
