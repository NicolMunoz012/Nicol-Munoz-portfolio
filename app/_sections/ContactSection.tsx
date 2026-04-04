'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";
import { Download, ExternalLink, Mail, Copy, Check } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export function ContactSection() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = "nicol@email.com";

  return (
    <section id="contact" className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal direction="left">
          <div className="rounded-3xl bg-surface/90 dark:bg-[#302149] dark:bg-[#5e448a] p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center mb-6">
              <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#6D0B31]/15" />
                <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
                  {t("sections.contact.title")}
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <motion.a
                href={`mailto:${email}`}
                className="group flex items-center justify-between gap-4 rounded-2xl bg-surface-2/90 dark:bg-##302149]/80 dark:bg-[#5e448a]/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/90 dark:bg-[#5e448a]/90"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Email</span>
                    <span className="text-xs text-foreground/60">{email}</span>
                  </div>
                </div>
                <span className="rounded-full bg-[#6D0B31]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-foreground/60 group-hover:bg-[#6D0B31]/25 group-hover:text-accent">
                  Mail
                </span>
              </motion.a>

              <motion.button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(email);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1400);
                  } catch {
                    setCopied(false);
                  }
                }}
                className="flex items-center justify-between gap-4 rounded-2xl bg-surface-2/90 dark:bg-##302149]/80 dark:bg-[#5e448a]/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/90 dark:bg-[#5e448a]/90 active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                    {copied ? (
                      <Check size={18} className="text-accent" />
                    ) : (
                      <Copy size={18} className="text-accent" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {copied ? t("sections.contact.form.copied") : t("sections.contact.form.copyEmail")}
                    </span>
                    <span className="text-xs text-foreground/60">{email}</span>
                  </div>
                </div>
                <span className="rounded-full bg-[#6D0B31]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                  {copied ? "OK" : "Copy"}
                </span>
              </motion.button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <motion.a
                  href="https://github.com/NicolMunoz012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-surface-2/90 dark:bg-##302149]/80 dark:bg-[#5e448a]/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/90 dark:bg-[#5e448a]/90"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                    <FaGithub size={18} className="text-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">GitHub</span>
                    <span className="text-xs text-foreground/60">@NicolMunoz012</span>
                  </div>
                </motion.a>

                <motion.a
                  href="https://linkedin.com/in/nicol-munoz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-surface-2/90 dark:bg-##302149]/80 dark:bg-[#5e448a]/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/90 dark:bg-[#5e448a]/90"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                    <FaLinkedin size={18} className="text-[#0077b5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">LinkedIn</span>
                    <span className="text-xs text-foreground/60">Profile</span>
                  </div>
                </motion.a>

                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-surface-2/90 dark:bg-##302149]/80 dark:bg-[#5e448a]/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/90 dark:bg-[#5e448a]/90 sm:col-span-2"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                    <FaInstagram size={18} className="text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Instagram</span>
                    <span className="text-xs text-foreground/60">Social</span>
                  </div>
                </motion.a>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="#"
                className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary-dark to-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-accent-foreground shadow-lg ring-1 ring-accent/25 transition-all hover:brightness-110 active:scale-95"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{t("hero.cvButton")}</span>
                <Download size={18} />
                <ExternalLink size={18} />
              </motion.a>
              <motion.a
                href="#projects"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#6D0B31]/15 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 active:scale-95"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t("sections.projects.title")}
              </motion.a>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-surface/90 dark:bg-[#302149] dark:bg-[#5e448a] p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                    Note
                  </span>
                  <span className="font-display text-xl font-bold text-foreground">
                    {t("hero.eyebrow")}
                  </span>
                </div>
                <div className="rounded-full bg-[#6D0B31]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                  16:3
                </div>
              </div>
              
              <div className="flex justify-center mb-6">
                <img 
                  src="/sheep.png" 
                  alt="Sheep" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              <p className="text-center text-sm leading-relaxed text-foreground/80">
                &quot;Pon en manos del Señor todas tus obras, y tus proyectos se cumplirán.&quot;
              </p>
              <p className="mt-2 text-center text-xs font-semibold text-accent">Proverbios 16:3</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}







