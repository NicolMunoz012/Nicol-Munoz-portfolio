"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../_context/LanguageContext";
import { useTheme } from "../_context/ThemeContext";
import { ArrowDownRight, Download, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function HeroSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] flex items-center justify-center py-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10">
        {/* Columna izquierda: Contenido de texto */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.h1
            className="font-display font-bold leading-[0.95]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <span className="block text-[clamp(1.3rem,3vw,2rem)] text-accent">
              {t("hero.greeting")}
            </span>
            <span className="block text-[clamp(2.6rem,6vw,4.6rem)]" style={{ color: theme === "dark" ? "#b31955" : "#6D0B31" }}>
              {t("hero.name")}
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-[16px] leading-relaxed text-foreground/80 sm:text-[18px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary-dark to-accent px-7 py-3.5 text-base font-semibold uppercase tracking-wider text-accent-foreground shadow-lg ring-1 ring-accent/25 transition-all hover:brightness-110 active:scale-95"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{t("hero.cvButton")}</span>
              <Download size={18} />
              <ExternalLink size={18} />
            </motion.a>

            <motion.a
              href="#contact"
              onClick={handleContactClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6D0B31]/15 px-7 py-3.5 text-base font-semibold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 active:scale-95"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{t("nav.contact")}</span>
              <ArrowDownRight size={18} />
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-5 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.38 }}
          >
            <motion.a
              href="https://github.com/NicolMunoz012"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/15 text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 hover:text-accent active:scale-90"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="GitHub"
            >
              <FaGithub size={18} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/nicol-mu%C3%B1oz-7b4b14307/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/15 text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 hover:text-accent active:scale-90"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </motion.a>
          </motion.div>
        </div>

        {/* Columna derecha: Imagen limpia con sombra */}
        <motion.div
          className="mx-auto flex items-center justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full max-w-md rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-4 shadow-xl">
            <div className="relative overflow-hidden rounded-2xl bg-surface-2/95 dark:bg-[#302149]/65 backdrop-blur-sm shadow-2xl">
              <div className="relative aspect-square">
                <Image
                  src="/me.jpg"
                  alt="Nicol Muñoz"
                  width={450}
                  height={550}
                  priority
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.22),transparent_55%)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}









