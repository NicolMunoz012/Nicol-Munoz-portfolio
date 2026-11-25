'use client';

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import { useLanguage } from "../_context/LanguageContext";
import { getTranslationArray } from "../_i18n";
import { Reveal } from "../_components/ui/Reveal";
import { SectionHeading } from "../_components/ui/SectionHeading";
import { handleTabListKeyDown } from "../_lib/a11y";

type ExperienceItem = {
  period: string;
  title: string;
  place: string;
  description?: string;
};

type Track = "academic" | "work";

const TRACKS = [
  { key: "academic", label: "sections.experience.academic" },
  { key: "work", label: "sections.experience.work" },
] as const;

const stepButton =
  "flex h-11 w-11 items-center justify-center rounded-full bg-card-2 text-foreground/80 shadow-sm transition-colors hover:bg-primary-dark/20 hover:text-accent disabled:opacity-40 disabled:hover:bg-card-2 disabled:hover:text-foreground/80";

export function ExperienceSection() {
  const { t, locale } = useLanguage();
  const [track, setTrack] = useState<Track>("academic");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const items = getTranslationArray(locale, `experience.${track}`) as ExperienceItem[];
  const selected = items[selectedIndex];
  const TrackIcon = track === "academic" ? GraduationCap : Briefcase;

  function select(index: number) {
    setSelectedIndex(index);
    // Mantiene visible el punto elegido cuando la línea de tiempo tiene scroll horizontal.
    const scroller = timelineRef.current;
    const node = scroller?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (scroller && node) {
      const nodeRect = node.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      scroller.scrollTo({
        left:
          scroller.scrollLeft +
          (nodeRect.left - scrollerRect.left) -
          (scroller.clientWidth - nodeRect.width) / 2,
      });
    }
  }

  return (
    <section id="experience" className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
      <div className="flex flex-col gap-10">
        <SectionHeading
          title={t("sections.experience.title")}
          subtitle={t("sections.experience.subtitle")}
        />

        <Reveal direction="up" delay={0.15}>
          <div
            role="tablist"
            aria-label={t("sections.experience.title")}
            onKeyDown={handleTabListKeyDown}
            className="surface-card mx-auto grid w-full max-w-3xl grid-cols-2 gap-2 rounded-3xl border border-primary-dark/15 p-2 shadow-xl"
          >
            {TRACKS.map(({ key, label }) => {
              const isSelected = track === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`experience-tab-${key}`}
                  aria-selected={isSelected}
                  aria-controls="experience-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => {
                    setTrack(key);
                    setSelectedIndex(0);
                    timelineRef.current?.scrollTo({ left: 0 });
                  }}
                  className={`relative min-h-11 rounded-2xl px-4 text-center text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                    isSelected ? "text-primary-foreground" : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  {isSelected ? (
                    <motion.span
                      layoutId="experience-track"
                      className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary to-primary-dark"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative">{t(label)}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.25}>
          <div
            id="experience-panel"
            role="tabpanel"
            aria-labelledby={`experience-tab-${track}`}
            className="mx-auto w-full max-w-5xl"
          >
            <div ref={timelineRef} className="custom-scrollbar relative overflow-x-auto">
              <div className="mx-auto w-max px-6 py-4">
                <ol aria-label={t("experience.timelineLabel")} className="relative flex items-start gap-12 md:gap-24">
                  <li aria-hidden className="absolute inset-x-0 top-[22px] h-px bg-border/70" />
                  {items.map((item, index) => {
                    const isActive = index === selectedIndex;
                    return (
                      <li key={`${item.period}-${item.title}`} data-index={index} className="relative">
                        <button
                          type="button"
                          onClick={() => select(index)}
                          aria-current={isActive ? "step" : undefined}
                          aria-label={`${item.title}, ${item.period}`}
                          className="group flex flex-col items-center gap-2 rounded-xl"
                        >
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-[background-color,scale] duration-200 ${
                              isActive
                                ? "scale-110 bg-primary text-primary-foreground"
                                : "bg-primary-dark/20 text-foreground/80 group-hover:bg-primary-dark/35"
                            }`}
                          >
                            <TrackIcon size={16} aria-hidden />
                          </span>
                          <span
                            className={`whitespace-nowrap text-xs font-bold uppercase tracking-widest ${
                              isActive ? "text-heading" : "text-foreground/70"
                            }`}
                          >
                            {item.period}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selected ? (
                <motion.article
                  key={`${track}-${selectedIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="surface-card mx-auto mt-4 max-w-4xl rounded-3xl p-6 shadow-lg"
                >
                  <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-primary-dark to-primary text-primary-foreground shadow-sm">
                        <TrackIcon size={18} aria-hidden />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="font-display text-lg font-bold text-foreground">{selected.title}</h3>
                        <p className="text-sm text-foreground/70">{selected.place}</p>
                      </div>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-primary-dark/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                      {selected.period}
                    </span>
                  </div>

                  {selected.description ? (
                    <p className="text-pretty text-base leading-relaxed text-foreground/80">
                      {selected.description}
                    </p>
                  ) : null}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => select(Math.max(0, selectedIndex - 1))}
                      disabled={selectedIndex === 0}
                      aria-label={t("experience.previous")}
                      className={stepButton}
                    >
                      <ArrowLeft size={16} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => select(Math.min(items.length - 1, selectedIndex + 1))}
                      disabled={selectedIndex >= items.length - 1}
                      aria-label={t("experience.next")}
                      className={stepButton}
                    >
                      <ArrowRight size={16} aria-hidden />
                    </button>
                  </div>
                </motion.article>
              ) : null}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
