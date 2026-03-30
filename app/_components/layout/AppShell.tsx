'use client';

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { NavigationMenu } from "./NavigationMenu";
import { CustomCursor } from "../ui/CustomCursor";
import { CinematicBackground } from "../ui/CinematicBackground";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sceneMap: Record<string, { x: number; y: number }> = {
      about: { x: -18, y: 12 },
      projects: { x: 18, y: 8 },
      testimonials: { x: -16, y: -10 },
      experience: { x: 20, y: 0 },
      skills: { x: -20, y: 14 },
      contact: { x: 0, y: 18 },
      footer: { x: 0, y: 0 },
    };

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

        const el = best?.el as HTMLElement | undefined;
        const id = el?.id;
        if (!id || id === lastId) return;
        lastId = id;

        const scene = sceneMap[id] ?? { x: 0, y: 0 };
        window.dispatchEvent(
          new CustomEvent("portfolio:section", { detail: { id, ...scene } }),
        );
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const t of targets) observer.observe(t);

    window.dispatchEvent(
      new CustomEvent("portfolio:section", { detail: { id: "hero", x: 0, y: 0 } }),
    );

    return () => observer.disconnect();
  }, []);

  // Comentario: Estructura general de la aplicación con la barra de navegación y el contenido principal.
  // El contenido principal se desliza hacia la derecha cuando el menú está abierto.
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground transition-colors duration-300">
      <CinematicBackground isMenuOpen={isMenuOpen} />
      <CustomCursor />
      {/* Menu Overlay/Sidebar */}
      <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <motion.div
        animate={{
          x: isMenuOpen ? "100%" : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
        }}
        className="flex min-h-screen flex-col transition-shadow duration-500"
      >
        <Navbar onMenuToggle={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} />
        <main className="flex w-full flex-1 flex-col gap-16 pb-16 pt-24 sm:pt-24 lg:pt-28">
          {children}
        </main>
      </motion.div>
    </div>
  );
}

