'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { getTranslationArray } from "../_i18n";
import { Reveal } from "../_components/ui/Reveal";
import { useYouTubePlayer } from "../_hooks/useYouTubePlayer";
import { BookCard, bookCardStyles } from "../_components/ui/BookCard";

// ── Inline marquee ──────────────────────────────────────────────────────────
const aboutMarqueeStyle = `
@keyframes about-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.about-marquee-track {
  display: flex;
  width: max-content;
  animation: about-marquee 14s linear infinite;
}
`;

function AboutMarquee({ text, className = '' }: { text: string; className?: string }) {
  const long = text.length > 26;
  return (
    <span style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}>
      {long ? (
        <span className="about-marquee-track">
          <span className={className} style={{ paddingRight: '3rem' }}>{text}</span>
          <span className={className} style={{ paddingRight: '3rem' }} aria-hidden>{text}</span>
        </span>
      ) : (
        <span className={className}>{text}</span>
      )}
    </span>
  );
}

// ISBNs verified — Open Library cover API
const BOOK_COVERS = [
  "https://covers.openlibrary.org/b/isbn/9788408004097-L.jpg",  // Buenos días, princesa
  "https://covers.openlibrary.org/b/isbn/0060528265-L.jpg",  // Veronika decide morir (edición alternativa)
  "https://covers.openlibrary.org/b/isbn/9789584239419-L.jpg",  // Satanás
  "https://covers.openlibrary.org/b/isbn/9788467053302-L.jpg",  // Cómo hacer…
  "https://covers.openlibrary.org/b/isbn/9788483655931-L.jpg",  // Yo antes de ti
];

const BOOK_COLORS = [
  "#e8b4c8",
  "#c4678a",
  "#6b1a3a",
  "#d4a0b5",
  "#8f3a5a",
];

export function AboutSection() {
  const { t, locale } = useLanguage();
  const [activeBio, setActiveBio] = useState<"bio1" | "bio2" | "bio3" | "playlist" | "books">("bio1");
  const [activeRecommendation, setActiveRecommendation] = useState<
    "playlist" | "books" | "podcast" | null
  >(null);
  const { isReady, isPlaying, currentTitle, currentChannel, progress, toggle, next, prev } =
    useYouTubePlayer();

  const toggleRecommendation = (key: "playlist" | "books") => {
    setActiveBio(key);
    setActiveRecommendation(key);
  };

  return (
    <section id="about" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 pt-6 pb-16">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <Reveal direction="up">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
            <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
            <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
              {t("sections.about.title")}
            </h2>
            <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal direction="left">
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-2xl bg-surface-2/95 dark:bg-[#302149]/65 backdrop-blur-sm shadow-2xl">
                <div className="relative aspect-square">
                  <img
                    src="/aboutme.jpg"
                    alt="About"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.22),transparent_55%)]" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl bg-[#6D0B31]/10 p-4 shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar -mx-1 px-1 pb-2">
                <div className="flex gap-2 min-w-max justify-center md:justify-between lg:min-w-0 lg:grid lg:grid-cols-5">
                  {([
                    { key: "bio1", label: t("about.tabs.profile") },
                    { key: "bio2", label: t("about.tabs.interests") },
                    { key: "bio3", label: t("about.tabs.community") },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveBio(key);
                        setActiveRecommendation(null);
                      }}
                      className={`relative rounded-2xl px-4 py-3 text-center text-[10.5px] font-bold uppercase tracking-wide transition-all overflow-hidden whitespace-nowrap ${
                        activeBio === key 
                          ? "text-white" 
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {activeBio === key ? (
                        <motion.span
                          layoutId="about-tab"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8F1242] to-[#6D0B31]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      ) : null}
                      <span className="relative block whitespace-nowrap">{label}</span>
                    </button>
                  ))}
                  
                  <motion.button
                    type="button"
                    onClick={() => toggleRecommendation("playlist")}
                    className={`relative rounded-2xl px-4 py-3 text-center text-[10.5px] font-bold uppercase tracking-wide transition-all overflow-hidden whitespace-nowrap ${
                      activeBio === "playlist"
                        ? "text-white"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeBio === "playlist" ? (
                      <motion.span
                        layoutId="about-tab"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8F1242] to-[#6D0B31]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative block whitespace-nowrap">{t("about.recommendations.playlist")}</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => toggleRecommendation("books")}
                    className={`relative rounded-2xl px-4 py-3 text-center text-[10.5px] font-bold uppercase tracking-wide transition-all overflow-hidden whitespace-nowrap ${
                      activeBio === "books"
                        ? "text-white"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeBio === "books" ? (
                      <motion.span
                        layoutId="about-tab"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8F1242] to-[#6D0B31]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative block whitespace-nowrap">{t("about.recommendations.books")}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-6 shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
              <AnimatePresence mode="wait">
                {activeBio === "bio1" || activeBio === "bio2" || activeBio === "bio3" ? (
                  <motion.div
                    key={activeBio}
                    className="relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-[17px] leading-relaxed text-foreground/85">
                      {activeBio === "bio1"
                        ? t("about.bio1")
                        : activeBio === "bio2"
                          ? t("about.bio2")
                          : t("about.bio3")}
                    </p>
                  </motion.div>
                ) : activeBio === "playlist" ? (
                  <motion.div
                    key="playlist"
                    className="relative"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                          {t("about.recommendationsTitle")}
                        </span>
                        <span className="font-display text-lg font-bold text-foreground">
                          {t("about.recommendations.playlist")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <style>{aboutMarqueeStyle}</style>
                      {/* Track info */}
                      <div className="mb-3 overflow-hidden">
                        <AboutMarquee
                          text={currentTitle || (isReady ? 'Cargando…' : 'Playlist de YouTube')}
                          className="text-[13px] font-semibold text-foreground"
                        />
                        {currentChannel && (
                          <AboutMarquee
                            text={currentChannel}
                            className="text-[11px] text-foreground/60 mt-0.5"
                          />
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-3">
                        <motion.button
                          type="button"
                          aria-label="Anterior"
                          onClick={prev}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6D0B31]/15 text-[#8F1242] transition-colors hover:bg-[#6D0B31]/25"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                          </svg>
                        </motion.button>

                        <motion.button
                          type="button"
                          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                          onClick={toggle}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #8F1242, #6D0B31)', boxShadow: '0 2px 14px rgba(143,18,66,0.38)' }}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isPlaying ? (
                              <motion.svg
                                key="pause"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.15 }}
                                width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                              >
                                <path d="M6 19h4V5H6zm8-14v14h4V5z" />
                              </motion.svg>
                            ) : (
                              <motion.svg
                                key="play"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.15 }}
                                width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </motion.button>

                        <motion.button
                          type="button"
                          aria-label="Siguiente"
                          onClick={next}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6D0B31]/15 text-[#8F1242] transition-colors hover:bg-[#6D0B31]/25"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
                          </svg>
                        </motion.button>
                      </div>

                      {/* Progress bar */}
                      <div
                        className="mt-3 h-1 w-full overflow-hidden rounded-full"
                        style={{ background: 'rgba(143,18,66,0.15)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #8F1242, #b31955)',
                            originX: 0,
                            scaleX: progress,
                          }}
                          animate={{ scaleX: progress }}
                          transition={{ duration: 0.4, ease: 'linear' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : activeBio === "books" ? (
                  <motion.div
                    key="books"
                    className="relative"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                          {t("about.recommendationsTitle")}
                        </span>
                        <span className="font-display text-lg font-bold text-foreground">
                          {t("about.recommendations.books")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <style>{bookCardStyles}</style>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                        {t("about.booksLabel")}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '10px',
                          justifyContent: 'center',
                        }}
                      >
                        {(getTranslationArray(locale, "about.books") as Array<{ title: string; author: string; review: string }>).map(
                          (book, i) => (
                            <BookCard
                              key={i}
                              title={book.title}
                              author={book.author}
                              cover={BOOK_COVERS[i]}
                              review={book.review}
                              color={BOOK_COLORS[i]}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {activeRecommendation ? null : null}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}









