"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useLanguage } from "../_context/LanguageContext";
import { CvPill } from "../_components/ui/CvPill";
import { SOCIAL_LINKS } from "../_lib/links";

const socialLink =
  "flex h-11 w-11 items-center justify-center rounded-full bg-primary-dark/15 text-foreground transition-[background-color,color,scale] hover:scale-105 hover:bg-primary-dark/25 hover:text-accent active:scale-95";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[75vh] w-full items-center justify-center py-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.h1
            className="font-display font-bold leading-[0.95]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <span className="block text-[clamp(1.3rem,3vw,2rem)] text-foreground">
              {t("hero.greeting")}
            </span>
            <span className="block text-[clamp(2.6rem,6vw,4.6rem)] text-heading">
              {t("hero.name")}
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
          >
            <CvPill />

            <a
              href="#contact"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary-dark/15 px-7 text-base font-semibold uppercase tracking-wider text-foreground shadow-sm transition-[background-color,scale] hover:scale-[1.03] hover:bg-primary-dark/25 active:scale-95"
            >
              <span>{t("nav.contact")}</span>
              <ArrowDownRight size={18} aria-hidden />
            </a>
          </motion.div>

          <motion.div
            className="mt-5 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.48 }}
          >
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className={socialLink} aria-label="GitHub">
              <FaGithub size={18} aria-hidden />
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={socialLink} aria-label="LinkedIn">
              <FaLinkedin size={18} aria-hidden />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto flex w-full items-center justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="surface-card w-full max-w-md rounded-3xl p-4 shadow-xl">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-card-2 shadow-2xl">
              <Image
                src="/nick.jpg"
                alt={t("hero.photoAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 416px, (min-width: 480px) 416px, 90vw"
                className="object-cover object-top"
              />
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.22),transparent_55%)]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
