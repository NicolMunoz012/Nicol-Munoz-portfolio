'use client';

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";
import { SectionHeading } from "../_components/ui/SectionHeading";
import { PlayerControls } from "../_components/ui/PlayerControls";
import { useYouTubePlayer } from "../_hooks/useYouTubePlayer";
import { handleTabListKeyDown } from "../_lib/a11y";

const TABS = [
  { key: "bio1", label: "about.tabs.profile" },
  { key: "bio2", label: "about.tabs.interests" },
  { key: "bio3", label: "about.tabs.community" },
  { key: "playlist", label: "about.recommendations.playlist" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AboutSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("bio1");
  // YouTube solo se carga cuando se abre la pestaña de la playlist.
  const [playlistOpened, setPlaylistOpened] = useState(false);
  const player = useYouTubePlayer(playlistOpened);

  return (
    <section id="about" className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
      <div className="mb-12">
        <SectionHeading title={t("sections.about.title")} />
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal direction="left">
          <div className="flex justify-center">
            <div className="surface-card w-full max-w-md rounded-3xl p-4 shadow-xl">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-card-2 shadow-2xl">
                <Image
                  src="/aboutme.jpg"
                  alt={t("about.photoAlt")}
                  fill
                  sizes="(min-width: 480px) 416px, 90vw"
                  className="object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.22),transparent_55%)]" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-3xl bg-primary-dark/10 p-3 shadow-lg">
              <div className="custom-scrollbar overflow-x-auto pb-1">
                <div
                  role="tablist"
                  aria-label={t("sections.about.title")}
                  onKeyDown={handleTabListKeyDown}
                  className="flex min-w-max gap-1 lg:grid lg:min-w-0 lg:grid-cols-4"
                >
                  {TABS.map(({ key, label }) => {
                    const selected = activeTab === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        id={`about-tab-${key}`}
                        aria-selected={selected}
                        aria-controls="about-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => {
                          setActiveTab(key);
                          if (key === "playlist") setPlaylistOpened(true);
                        }}
                        className={`relative min-h-11 whitespace-nowrap rounded-2xl px-4 text-center text-xs font-bold uppercase tracking-wide transition-colors ${
                          selected ? "text-primary-foreground" : "text-foreground/75 hover:text-foreground"
                        }`}
                      >
                        {selected ? (
                          <motion.span
                            layoutId="about-tab"
                            className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary to-primary-dark"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        ) : null}
                        <span className="relative">{t(label)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              id="about-panel"
              role="tabpanel"
              aria-labelledby={`about-tab-${activeTab}`}
              tabIndex={0}
              className="surface-card overflow-hidden rounded-3xl p-6 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "playlist" ? (
                    <>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
                        {t("about.recommendationsTitle")}
                      </p>
                      <h3 className="mb-4 font-display text-lg font-bold text-foreground">
                        {t("about.recommendations.playlist")}
                      </h3>
                      <PlayerControls player={player} />
                    </>
                  ) : (
                    <p className="text-pretty text-[17px] leading-relaxed text-foreground/85">
                      {t(`about.${activeTab}`)}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
