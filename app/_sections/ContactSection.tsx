'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";
import { Download, ExternalLink, Mail, Copy, Check } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const cvLinks = {
  es: {
    preview: 'https://drive.google.com/file/d/1di72M4u4w54WpQVbkvN1NZcRhhGOG-As/view',
    download: 'https://drive.google.com/uc?export=download&id=1di72M4u4w54WpQVbkvN1NZcRhhGOG-As',
  },
  en: {
    preview: 'https://drive.google.com/file/d/1Ni-VZyIy31vNN8g1cyWQUcxNHCQT1cXp/view',
    download: 'https://drive.google.com/uc?export=download&id=1Ni-VZyIy31vNN8g1cyWQUcxNHCQT1cXp',
  },
};

export function ContactSection() {
  const { t, locale } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = "nicol@email.com";
  const currentLang = locale as 'es' | 'en';

  return (
    <>
      <section id="contact" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 pt-6 pb-16">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        <Reveal direction="up">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
              <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
              <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
                {t("sections.contact.title")}
              </h2>
              <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-6 shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
              
              <div className="relative mt-8 grid grid-cols-1 gap-3">
                <motion.a
                  href={`mailto:${email}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl bg-surface-2/90 dark:bg-[#302149]/60 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/65"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                      <Mail size={18} className="text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-foreground">Email</span>
                      <span className="text-sm text-foreground/60">{email}</span>
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
                  className="flex items-center justify-between gap-4 rounded-2xl bg-surface-2/90 dark:bg-[#302149]/60 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/65 active:scale-[0.99]"
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
                      <span className="text-base font-bold text-foreground">
                        {copied ? t("sections.contact.form.copied") : t("sections.contact.form.copyEmail")}
                      </span>
                      <span className="text-sm text-foreground/60">{email}</span>
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
                    className="group flex items-center gap-4 rounded-2xl bg-surface-2/90 dark:bg-[#302149]/60 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/65"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                      <FaGithub size={18} className="text-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-foreground">GitHub</span>
                      <span className="text-sm text-foreground/60">@NicolMunoz012</span>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://linkedin.com/in/nicol-munoz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-surface-2/90 dark:bg-[#302149]/60 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/65"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                      <FaLinkedin size={18} className="text-[#0077b5]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-foreground">LinkedIn</span>
                      <span className="text-sm text-foreground/60">Profile</span>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-surface-2/90 dark:bg-[#302149]/60 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-surface-2/95 dark:bg-[#302149]/65 sm:col-span-2"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                      <FaInstagram size={18} className="text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-foreground">Instagram</span>
                      <span className="text-sm text-foreground/60">Social</span>
                    </div>
                  </motion.a>
                </div>
              </div>

              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-primary-dark to-accent px-8 py-4 shadow-lg ring-1 ring-accent/25">
                  <span className="text-base font-semibold uppercase tracking-wider text-accent-foreground mr-2">CV</span>
                  
                  {/* Ícono previsualizar */}
                  <a 
                    href={cvLinks[currentLang].preview} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full p-1.5 hover:bg-white/20 transition-colors"
                    title="Previsualizar CV"
                  >
                    <ExternalLink size={16} className="text-accent-foreground" />
                  </a>
                  
                  {/* Separador vertical */}
                  <span className="h-4 w-px bg-accent-foreground/30" />
                  
                  {/* Ícono descargar */}
                  <a 
                    href={cvLinks[currentLang].download} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full p-1.5 hover:bg-white/20 transition-colors"
                    title="Descargar CV"
                  >
                    <Download size={16} className="text-accent-foreground" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Nueva sección para la oveja y el versículo */}
      <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 pt-6 pb-16">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <Reveal direction="up">
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-8 shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
              
              <div className="relative flex justify-center mb-6">
                <img 
                  src="/sheep.png" 
                  alt="Sheep" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              <p className="text-center text-base leading-relaxed text-foreground/80">
                &quot;Pon en manos del Señor todas tus obras, y tus proyectos se cumplirán.&quot;
              </p>
              <p className="mt-2 text-center text-sm font-semibold text-accent">Proverbios 16:3</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}









