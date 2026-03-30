'use client';

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { getTranslationArray } from "../_i18n";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

function getInitials(input: string) {
  const clean = input.replace(/[—-]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
}

export function TestimonialsSection() {
  const { locale, t } = useLanguage();
  const testimonials = getTranslationArray(locale, "testimonials.items") as Testimonial[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(3);
      else if (w >= 768) setVisibleCount(2);
      else setVisibleCount(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, testimonials.length - visibleCount),
    [testimonials.length, visibleCount],
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, Math.min(maxIndex, prev - 1)));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.max(0, Math.min(maxIndex, prev + 1)));
  };

  const canNavigate = testimonials.length > visibleCount;
  const safeIndex = Math.min(currentIndex, maxIndex);

  useEffect(() => {
    if (isPaused) return;
    if (testimonials.length <= visibleCount) return;

    const id = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 6500);

    return () => window.clearInterval(id);
  }, [isPaused, testimonials.length, visibleCount, maxIndex]);

  useEffect(() => {
    if (!canNavigate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canNavigate, maxIndex]);

  const visibleTestimonials = useMemo(
    () => testimonials.slice(safeIndex, safeIndex + visibleCount),
    [testimonials, safeIndex, visibleCount],
  );

  return (
    <section id="testimonials" className="relative w-full bg-primary-dark py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(229,154,196,0.22),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_80%,rgba(143,18,66,0.28),transparent_60%)]" />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10">
        <motion.h2
          className="mb-3 text-center font-display text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-accent-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("sections.testimonials.title")}
        </motion.h2>
        <motion.p
          className="mx-auto mb-12 max-w-2xl text-center text-base text-accent-foreground/75"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          {t("sections.testimonials.subtitle")}
        </motion.p>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            drag={canNavigate ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            whileTap={{ cursor: canNavigate ? "grabbing" : "default" }}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={(_, info) => {
              const swipe = Math.abs(info.offset.x) * info.velocity.x;
              if (swipe < -8000) handleNext();
              else if (swipe > 8000) handlePrev();
            }}
            style={{ cursor: canNavigate ? "grab" : "default" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {visibleTestimonials.map((testimonial, index) => (
                <motion.article
                  key={`${safeIndex}-${testimonial.author}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-surface/30 p-6 shadow-lg backdrop-blur-sm transition-colors hover:bg-surface/40"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6D0B31]/20 text-xs font-bold tracking-widest text-accent-foreground shadow-sm backdrop-blur-md">
                        {getInitials(testimonial.author)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-accent-foreground">
                          {testimonial.author}
                        </span>
                        <span className="text-xs text-accent-foreground/65">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-accent-foreground/70">
                      <span aria-hidden className="text-xs">★</span>
                      <span aria-hidden className="text-xs">★</span>
                      <span aria-hidden className="text-xs">★</span>
                      <span aria-hidden className="text-xs">★</span>
                      <span aria-hidden className="text-xs">★</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="mb-3 text-4xl leading-none text-accent-foreground/30">
                      “
                    </div>
                    <p className="text-sm leading-relaxed text-accent-foreground/90">
                      {testimonial.quote}
                    </p>
                  </div>

                  <div className="relative mt-auto flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#6D0B31]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent-foreground/90">
                      {t("sections.testimonials.title")}
                    </span>
                    <span className="text-xs text-accent-foreground/55">★★★★★</span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {canNavigate ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={handlePrev}
                  disabled={safeIndex === 0}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2/40 text-accent-foreground backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 disabled:cursor-not-allowed disabled:opacity-30 active:scale-90"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Previous testimonials"
                >
                  <FaChevronLeft size={16} />
                </motion.button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to testimonials page ${i + 1}`}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all active:scale-90 ${
                        i === safeIndex
                          ? "w-8 bg-accent"
                          : "w-2 bg-accent/30 hover:bg-accent/50"
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={handleNext}
                  disabled={safeIndex >= maxIndex}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2/40 text-accent-foreground backdrop-blur-sm transition-all hover:bg-[#6D0B31]/25 disabled:cursor-not-allowed disabled:opacity-30 active:scale-90"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Next testimonials"
                >
                  <FaChevronRight size={16} />
                </motion.button>
              </div>

              <div className="text-xs text-accent-foreground/55">
                {t("sections.testimonials.subtitle")}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
