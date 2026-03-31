'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";

const ABOUT_IMAGES = [
  "/about-1.jpg",
  "/about-2.jpg",
  "/about-3.jpg",
  "/about-4.jpg",
];

export function AboutSection() {
  const { t } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBio, setActiveBio] = useState<"bio1" | "bio2" | "bio3">("bio1");
  const [activeRecommendation, setActiveRecommendation] = useState<
    "playlist" | "books" | "podcast" | null
  >(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImage((prev) => (prev + 1) % ABOUT_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const paginateImage = (nextDirection: 1 | -1) => {
    setDirection(nextDirection);
    setCurrentImage((prev) => {
      const next = prev + nextDirection;
      const len = ABOUT_IMAGES.length;
      return ((next % len) + len) % len;
    });
  };

  const toggleRecommendation = (key: "playlist" | "books" | "podcast") => {
    setActiveRecommendation((current) => (current === key ? null : key));
  };

  const imageVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 28 : -28, scale: 1.01 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -28 : 28, scale: 0.99 }),
  };

  return (
    <section id="about" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 pt-6 pb-16">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <Reveal direction="up">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
            <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
              {t("sections.about.title")}
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal direction="left">
          <div
            className="rounded-3xl bg-surface/30 p-4 shadow-xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-surface-2/40 backdrop-blur-sm">
              <motion.div
                className="relative aspect-square cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragStart={() => setIsPaused(true)}
                onDragEnd={(_, info) => {
                  const swipe = Math.abs(info.offset.x) * info.velocity.x;
                  if (swipe < -8000) paginateImage(1);
                  else if (swipe > 8000) paginateImage(-1);
                }}
                whileTap={{ scale: 0.995 }}
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={currentImage}
                    src={ABOUT_IMAGES[currentImage]}
                    alt={`About ${currentImage + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    draggable={false}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.22),transparent_55%)]" />
                <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#6D0B31]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {t("about.galleryLabel")}
                  </span>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#6D0B31]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/70 backdrop-blur-md">
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => paginateImage(-1)}
                      className="rounded-full px-2 py-1 transition-colors hover:text-accent"
                    >
                      ←
                    </button>
                    <span className="text-foreground/40">/</span>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => paginateImage(1)}
                      className="rounded-full px-2 py-1 transition-colors hover:text-accent"
                    >
                      →
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-3 overflow-hidden rounded-full bg-surface/30 backdrop-blur-sm">
              <motion.div
                key={`${currentImage}-${isPaused ? "paused" : "play"}`}
                className="h-1.5 origin-left bg-gradient-to-r from-primary-dark to-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isPaused ? 0 : 1 }}
                transition={{ duration: isPaused ? 0 : 5, ease: "linear" }}
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {ABOUT_IMAGES.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    setDirection(i > currentImage ? 1 : -1);
                    setCurrentImage(i);
                  }}
                  aria-label={`About image ${i + 1}`}
                  className={`h-10 w-10 overflow-hidden rounded-xl transition-all ${
                    i === currentImage
                      ? "ring-2 ring-accent/40"
                      : "opacity-60 hover:opacity-90"
                  }`}
                >
                  <span
                    className="block h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl bg-[#6D0B31]/10 p-3 shadow-lg backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: "bio1", label: t("about.tabs.profile") },
                  { key: "bio2", label: t("about.tabs.interests") },
                  { key: "bio3", label: t("about.tabs.community") },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveBio(key)}
                    className={`relative rounded-2xl px-3 py-3 text-center text-[11px] font-bold uppercase tracking-widest transition-all ${
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
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-surface/30 p-6 shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBio}
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[15px] leading-relaxed text-foreground/85">
                    {activeBio === "bio1"
                      ? t("about.bio1")
                      : activeBio === "bio2"
                        ? t("about.bio2")
                        : t("about.bio3")}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-2 flex flex-wrap gap-3">
              <motion.button
                type="button"
                onClick={() => toggleRecommendation("playlist")}
                className="inline-flex items-center gap-2 rounded-full bg-[#6D0B31]/15 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 hover:text-accent active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎵 {t("about.recommendations.playlist")}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => toggleRecommendation("books")}
                className="inline-flex items-center gap-2 rounded-full bg-[#6D0B31]/15 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 hover:text-accent active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📚 {t("about.recommendations.books")}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => toggleRecommendation("podcast")}
                className="inline-flex items-center gap-2 rounded-full bg-[#6D0B31]/15 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 hover:text-accent active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎙️ {t("about.recommendations.podcast")}
              </motion.button>
            </div>

            <AnimatePresence>
              {activeRecommendation ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl bg-surface/30 p-5 shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                        {t("about.recommendationsTitle")}
                      </span>
                      <span className="font-display text-lg font-bold text-foreground">
                        {activeRecommendation === "playlist"
                          ? t("about.recommendations.playlist")
                          : activeRecommendation === "books"
                            ? t("about.recommendations.books")
                            : t("about.recommendations.podcast")}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setActiveRecommendation(null)}
                      className="rounded-full bg-[#6D0B31]/20 px-3 py-1.5 text-xs font-semibold text-foreground/70 transition-colors hover:bg-[#6D0B31]/30 hover:text-accent active:scale-95"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    {activeRecommendation === "playlist"
                      ? t("about.recommendationsDetail.playlist")
                      : activeRecommendation === "books"
                        ? t("about.recommendationsDetail.books")
                        : t("about.recommendationsDetail.podcast")}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
