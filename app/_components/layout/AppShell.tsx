'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { NavigationMenu } from "./NavigationMenu";
import { Footer } from "./Footer";
import { CustomCursor } from "../ui/CustomCursor";
import { CinematicBackground } from "../ui/CinematicBackground";
import { MiniPlayer } from "../ui/MiniPlayer";
import { useLanguage } from "../../_context/LanguageContext";

type AppShellProps = {
  children: ReactNode;
};

// Desplazamiento del fondo de partículas según la sección visible.
const SCENE_MAP: Record<string, { x: number; y: number }> = {
  about: { x: -18, y: 12 },
  projects: { x: 18, y: 8 },
  testimonials: { x: -16, y: -10 },
  experience: { x: 20, y: 0 },
  skills: { x: -20, y: 14 },
  contact: { x: 0, y: 18 },
  footer: { x: 0, y: 0 },
};

export function AppShell({ children }: AppShellProps) {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id], footer#footer"),
    );

    const ratios = new Map<Element, number>();
    let lastId: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best: { el: Element; ratio: number } | null = null;
        for (const [el, ratio] of ratios.entries()) {
          if (!best || ratio > best.ratio) best = { el, ratio };
        }

        const id = best?.el.id;
        if (!id || id === lastId) return;
        lastId = id;

        const scene = SCENE_MAP[id] ?? { x: 0, y: 0 };
        window.dispatchEvent(
          new CustomEvent("portfolio:section", { detail: { id, ...scene } }),
        );
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const target of targets) observer.observe(target);

    return () => observer.disconnect();
  }, []);

  // Con el menú abierto la página de fondo no debe desplazarse.
  useEffect(() => {
    if (!isMenuOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isMenuOpen]);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setIsMenuOpen(false);
    if (restoreFocus) {
      // Tras cerrar, el contenido deja de ser `inert` en el siguiente render.
      requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }));
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <a href="#main" className="skip-link">
        {t("nav.skipToContent")}
      </a>

      <CinematicBackground isMenuOpen={isMenuOpen} />
      <CustomCursor />

      <NavigationMenu isOpen={isMenuOpen} onClose={closeMenu} />

      {/* El contenido se desliza a la derecha y queda inerte mientras el menú está abierto. */}
      <motion.div
        inert={isMenuOpen}
        animate={{ x: isMenuOpen ? "100%" : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="flex min-h-screen flex-col overflow-x-hidden"
      >
        <Navbar
          menuButtonRef={menuButtonRef}
          onMenuToggle={() => setIsMenuOpen(true)}
          isMenuOpen={isMenuOpen}
        />
        <main
          id="main"
          tabIndex={-1}
          className="flex w-full flex-1 flex-col pb-16 pt-24 outline-none lg:pt-28"
        >
          {children}
        </main>
        <Footer />
        <MiniPlayer />
      </motion.div>
    </div>
  );
}
