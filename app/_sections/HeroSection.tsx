"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../_context/LanguageContext";
import { ArrowDownRight, Download, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden pb-16 pt-24 sm:pt-20 lg:pt-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface-2/50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/70 backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{t("hero.eyebrow")}</span>
          </motion.div>

          <motion.h1
            className="font-display font-bold leading-[0.95]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <span className="block text-[clamp(1.5rem,3.5vw,2.6rem)] text-accent">
              {t("hero.greeting")}
            </span>
            <span className="block text-[clamp(2.6rem,6vw,4.6rem)] text-foreground">
              {t("hero.name")}
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-[15px] leading-relaxed text-foreground/80 sm:text-[16px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
          >
            <motion.a
              href="#"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary-dark to-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground shadow-lg ring-1 ring-accent/25 transition-all hover:brightness-110 active:scale-95"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{t("hero.cvButton")}</span>
              <Download size={18} />
              <ExternalLink size={18} />
            </motion.a>

            <motion.a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-foreground shadow-sm backdrop-blur transition-all hover:border-accent/40 hover:bg-surface-2/60 active:scale-95"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{t("nav.contact")}</span>
              <ArrowDownRight size={18} />
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.38 }}
          >
            <motion.a
              href="https://github.com/NicolMunoz012"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-2/60 text-foreground shadow-sm backdrop-blur transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:scale-90"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/nicol-mu%C3%B1oz-7b4b14307/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-2/60 text-foreground shadow-sm backdrop-blur transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:scale-90"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface/40 p-2 shadow-2xl backdrop-blur">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-surface-2">
              <Image
                src="/profile.jpg"
                alt="Nicol Muñoz"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(229,154,196,0.20),transparent_55%)]" />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-[1.4rem] border border-accent/10 bg-surface-2/40 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                {t("hero.animationPlaceholderTitle")}
              </span>
              <span className="text-xs text-foreground/60">
                {t("hero.animationPlaceholderBody")}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
