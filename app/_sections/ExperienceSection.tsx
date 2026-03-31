'use client';

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
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
  const academic = getTranslationArray(locale, "experience.academic") as ExperienceItem[];
  const work = getTranslationArray(locale, "experience.work") as ExperienceItem[];
  const [track, setTrack] = useState<Track>("academic");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
              <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
                {t("sections.experience.title")}
              </h2>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
            </div>
            <p className="max-w-2xl text-base text-foreground/70">
              {t("sections.experience.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <div className="mx-auto w-full max-w-3xl">
            <div className="rounded-3xl bg-surface/30 p-2 shadow-lg backdrop-blur-sm">
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
                      setSelectedIndex(null);
                    }}
                    className={`relative rounded-2xl px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest transition-colors ${
                      track === key
                        ? "text-accent-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {track === key ? (
                      <motion.span
                        layoutId="experience-track"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-dark to-accent"
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
              <div className="min-w-[640px] px-6 py-8">
                <div className="relative h-[68px]">
                  <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border/70" />
                  {selectedIndex !== null ? (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        left:
                          items.length > 1
                            ? `${(selectedIndex / (items.length - 1)) * 100}%`
                            : "0%",
                      }}
                    >
                      <motion.div
                        layoutId="exp-active"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-dark to-accent shadow-lg"
                        animate={{ scale: 1.18 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                      >
                        {track === "academic" ? (
                          <GraduationCap size={18} className="text-accent-foreground" />
                        ) : (
                          <Briefcase size={18} className="text-accent-foreground" />
                        )}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface/80 px-4 py-2 text-xs font-semibold text-foreground/70 shadow-sm backdrop-blur-md">
                      {t("sections.experience.selectHint")}
                    </div>
                  )}

                  <div className="relative flex items-center justify-between">
                    {items.map((it, idx) => {
                      const isActive = idx === selectedIndex;
                      return (
                        <button
                          key={`${it.period}-${it.title}-${idx}`}
                          type="button"
                          onClick={() => setSelectedIndex((cur) => (cur === idx ? null : idx))}
                          className="group relative flex flex-col items-center gap-2"
                          aria-label={`${it.title} ${it.period}`}
                        >
                          <motion.div
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6D0B31]/20 shadow-sm backdrop-blur-sm"
                            animate={{ scale: isActive ? 1.12 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          >
                            {track === "academic" ? (
                              <GraduationCap size={16} className="text-accent-foreground" />
                            ) : (
                              <Briefcase size={16} className="text-accent-foreground" />
                            )}
                          </motion.div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
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
              {selectedIndex !== null ? (
                <motion.div
                  key={`${items[selectedIndex]?.title}-${selectedIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto mt-4 max-w-4xl"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-surface/30 p-6 shadow-lg backdrop-blur-sm">
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
                      <span className="shrink-0 rounded-full bg-[#6D0B31]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                        {items[selectedIndex]?.period}
                      </span>
                    </div>

                    {items[selectedIndex]?.description ? (
                      <p className="relative text-sm leading-relaxed text-foreground/80">
                        {items[selectedIndex]?.description}
                      </p>
                    ) : null}

                    <div className="relative mt-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIndex((i) =>
                            i === null ? 0 : Math.max(0, i - 1),
                          )
                        }
                        disabled={selectedIndex === 0}
                        className="rounded-full bg-surface-2/40 px-4 py-2 text-xs font-semibold text-foreground/70 shadow-sm backdrop-blur-sm transition-colors hover:bg-[#6D0B31]/20 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(null)}
                        className="rounded-full bg-surface-2/40 px-4 py-2 text-xs font-semibold text-foreground/70 shadow-sm backdrop-blur-sm transition-colors hover:bg-[#6D0B31]/20 hover:text-accent"
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIndex((i) =>
                            i === null ? 0 : Math.min(items.length - 1, i + 1),
                          )
                        }
                        disabled={selectedIndex >= items.length - 1}
                        className="rounded-full bg-surface-2/40 px-4 py-2 text-xs font-semibold text-foreground/70 shadow-sm backdrop-blur-sm transition-colors hover:bg-[#6D0B31]/20 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
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
