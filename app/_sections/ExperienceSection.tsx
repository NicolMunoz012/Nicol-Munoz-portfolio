'use client';

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { useTheme } from "../_context/ThemeContext";
import { getTranslationArray } from "../_i18n";
import { Reveal } from "../_components/ui/Reveal";
import { Briefcase, GraduationCap } from "lucide-react";

type ExperienceItem = {
  period: string;
  title: string;
  place: string;
  description?: string;
};

type Track = "academic" | "work";

export function ExperienceSection() {
  const { t, locale } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const academic = getTranslationArray(locale, "experience.academic") as ExperienceItem[];
  const work = getTranslationArray(locale, "experience.work") as ExperienceItem[];
  const [track, setTrack] = useState<Track>("academic");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const items = useMemo(
    () => (track === "academic" ? academic : work),
    [track, academic, work],
  );

  return (
    <section id="experience" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-16">
      <div className="flex flex-col gap-10">
        <Reveal direction="up">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
              <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
              <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#a91852]">
                {t("sections.experience.title")}
              </h2>
              <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
            </div>
            <p className="max-w-2xl text-lg text-foreground/70">
              {t("sections.experience.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <div className="mx-auto w-full max-w-3xl">
            <div className="rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-2 shadow-xl backdrop-blur-sm border-1 border-[#6D0B31]/15">
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: "academic", label: t("sections.experience.academic") },
                  { key: "work", label: t("sections.experience.work") },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setTrack(key);
                      setSelectedIndex(0);
                    }}
                    className={`relative rounded-2xl px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${track === key
                      ? "text-white"
                      : "text-foreground/70 hover:text-foreground"
                      }`}
                  >
                    {track === key ? (
                      <motion.span
                        layoutId="experience-track"
                        className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-[#a91852]' : 'bg-[#6D0B31]'}`}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.25}>
          <div className="relative mx-auto w-full max-w-5xl">
            <div className="relative overflow-x-auto">
              <div className="min-w-[640px] px-6 py-4">

                <div className="relative">
                  {/* Línea horizontal */}
                  <div className="absolute left-0 right-0 top-5 h-px bg-border/70" />

                  {/* Botones de la timeline */}
                  <div className="relative flex items-start justify-between">
                    {items.map((it, idx) => {
                      const isActive = idx === selectedIndex;
                      return (
                        <button
                          key={`${it.period}-${it.title}-${idx}`}
                          type="button"
                          onClick={() => setSelectedIndex(idx)}
                          className="group relative flex flex-col items-center gap-2"
                          aria-label={`${it.title} ${it.period}`}
                        >
                          {/* Ícono del punto en la línea */}
                          <motion.div
                            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors ${
                              isActive
                                ? isDark ? "bg-[#b31955]" : "bg-[#6D0B31]"
                                : isDark ? "bg-[#b31955]/20" : "bg-[#6D0B31]/20"
                            }`}
                            animate={{ scale: isActive ? 1.18 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          >
                            {track === "academic" ? (
                              <GraduationCap size={16} className={isActive ? "text-white" : "text-accent-foreground"} />
                            ) : (
                              <Briefcase size={16} className={isActive ? "text-white" : "text-accent-foreground"} />
                            )}
                          </motion.div>
                          {/* Período debajo del ícono */}
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            isActive 
                              ? isDark ? "text-[#a91852]" : "text-[#6D0B31]"
                              : "text-foreground/60"
                          }`}>
                            {it.period}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedIndex !== null && items[selectedIndex] ? (
                <motion.div
                  key={`${items[selectedIndex]?.title}-${selectedIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto mt-4 max-w-4xl"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-6 shadow-lg backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
                    <div className="relative mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-dark to-accent shadow-sm">
                          {track === "academic" ? (
                            <GraduationCap size={18} className="text-accent-foreground" />
                          ) : (
                            <Briefcase size={18} className="text-accent-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display text-lg font-bold text-foreground">
                            {items[selectedIndex]?.title}
                          </span>
                          <span className="text-xs text-foreground/60">
                            {items[selectedIndex]?.place}
                          </span>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
                        isDark ? 'bg-[#a91852]/20' : 'bg-[#6D0B31]/20'
                      } text-accent`}>
                        {items[selectedIndex]?.period}
                      </span>
                    </div>

                    {items[selectedIndex]?.description ? (
                      <p className="relative text-base leading-relaxed text-foreground/80">
                        {items[selectedIndex]?.description}
                      </p>
                    ) : null}

                    <div className="relative mt-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIndex((i) => Math.max(0, i - 1))
                        }
                        disabled={selectedIndex === 0}
                        className={`rounded-full bg-surface-2/95 dark:bg-[#302149]/65 px-4 py-2 text-xs font-semibold text-foreground/70 shadow-sm backdrop-blur-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          isDark ? 'hover:bg-[#a91852]/20' : 'hover:bg-[#6D0B31]/20'
                        } hover:text-accent`}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIndex((i) => Math.min(items.length - 1, i + 1))
                        }
                        disabled={selectedIndex >= items.length - 1}
                        className={`rounded-full bg-surface-2/95 dark:bg-[#302149]/65 px-4 py-2 text-xs font-semibold text-foreground/70 shadow-sm backdrop-blur-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          isDark ? 'hover:bg-[#a91852]/20' : 'hover:bg-[#6D0B31]/20'
                        } hover:text-accent`}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </motion.div>
                ) : null}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}









