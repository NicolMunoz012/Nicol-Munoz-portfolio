'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../_context/LanguageContext';
import { getTranslationArray } from '../_i18n';
import { Reveal } from '../_components/ui/Reveal';

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/* ── Single testimonial card ── */
function TestimonialCard({ item }: { item: Testimonial }) {
  const initials = item.author
    .replace(/[—-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      style={{
        flex: '0 0 300px',
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
        border: '1.5px solid rgba(244,192,209,0.18)',
        borderRadius: '20px',
        padding: '24px 22px 20px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow:
          '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        userSelect: 'none',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        cursor: 'default',
        minHeight: '0',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          'rgba(244,192,209,0.42)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 8px 36px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          'rgba(244,192,209,0.18)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)';
      }}
    >
      {/* Opening quote */}
      <span
        aria-hidden
        style={{
          fontSize: '40px',
          lineHeight: '1',
          color: '#f4c0d1',
          opacity: 0.45,
          fontFamily: 'Georgia, serif',
          display: 'block',
          marginBottom: '-8px',
        }}
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <p
        style={{
          margin: 0,
          fontSize: '13.5px',
          lineHeight: 1.7,
          color: 'rgba(244,213,228,0.88)',
          flexGrow: 1,
        }}
      >
        {item.quote}
      </p>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(244,192,209,0.25), transparent)',
        }}
      />

      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #8F1242 0%, #6D0B31 100%)',
            border: '1.5px solid rgba(244,192,209,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#f4d5e4',
            flexShrink: 0,
            letterSpacing: '0.05em',
          }}
        >
          {initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#f4d5e4',
              lineHeight: 1.2,
            }}
          >
            {item.author}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(244,213,228,0.55)',
              lineHeight: 1.2,
            }}
          >
            {item.role}
          </span>
        </div>

        {/* Stars */}
        <span
          aria-hidden
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: '#f4c0d1',
            opacity: 0.7,
            letterSpacing: '2px',
          }}
        >
          ★★★★★
        </span>
      </div>
    </article>
  );
}

/* ── Main section ── */
export function TestimonialsSection() {
  const { locale, t } = useLanguage();
  const testimonials = getTranslationArray(
    locale,
    'testimonials.items',
  ) as Testimonial[];

  const trackRef = useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const dragRef = useRef({
    active: false,
    lastX: 0,
    offset: 0, // accumulated drag offset in px
  });

  // Duration — longer list = slower (more natural)
  const DURATION = Math.max(testimonials.length * 5, 20);

  // One "set" width = 25% of total track (we have 4 copies)
  function getOneSetWidth() {
    return (trackRef.current?.scrollWidth ?? 0) / 4;
  }

  // Read the current translateX the CSS animation is rendering
  function getComputedOffsetPx(): number {
    const el = trackRef.current;
    if (!el) return 0;
    const m = window.getComputedStyle(el).transform.match(/matrix\(([^)]+)\)/);
    if (!m) return 0;
    return -parseFloat(m[1].split(',')[4]); // tx value is negative → return positive
  }

  // Resume animation from a given pixel offset (seamless, no snap)
  function resumeFromOffset(offsetPx: number) {
    const el = trackRef.current;
    if (!el) return;
    const W = getOneSetWidth();
    const fraction = W > 0 ? ((offsetPx % W) + W) % W / W : 0;
    el.style.transform = '';
    el.style.animationDelay = `-${fraction * DURATION}s`;
    el.style.animationPlayState = 'running';
    dragRef.current.offset = 0;
  }

  /* ── Mouse drag (desktop) ── */
  function onMouseDown(e: React.MouseEvent) {
    const currentOffset = getComputedOffsetPx();
    dragRef.current.active = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.offset = currentOffset;
    setIsGrabbing(true);
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
      trackRef.current.style.transform = `translateX(-${currentOffset}px)`;
    }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragRef.current.active || !trackRef.current) return;
    const dx = dragRef.current.lastX - e.clientX;
    dragRef.current.lastX = e.clientX;
    const W = getOneSetWidth();
    dragRef.current.offset = W > 0
      ? ((dragRef.current.offset + dx) % W + W) % W
      : 0;
    trackRef.current.style.transform = `translateX(-${dragRef.current.offset}px)`;
  }
  function onMouseUp() {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsGrabbing(false);
    resumeFromOffset(dragRef.current.offset);
  }
  // Also release if mouse leaves while dragging
  function onMouseLeave() {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      setIsGrabbing(false);
      resumeFromOffset(dragRef.current.offset);
    }
  }

  /* ── Touch (mobile swipe) ── */
  function onTouchStart(e: React.TouchEvent) {
    const currentOffset = getComputedOffsetPx();
    dragRef.current.active = true;
    dragRef.current.lastX = e.touches[0].clientX;
    dragRef.current.offset = currentOffset;
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
      trackRef.current.style.transform = `translateX(-${currentOffset}px)`;
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!dragRef.current.active || !trackRef.current) return;
    const dx = dragRef.current.lastX - e.touches[0].clientX;
    dragRef.current.lastX = e.touches[0].clientX;
    const W = getOneSetWidth();
    dragRef.current.offset = W > 0
      ? ((dragRef.current.offset + dx) % W + W) % W
      : 0;
    trackRef.current.style.transform = `translateX(-${dragRef.current.offset}px)`;
  }
  function onTouchEnd() {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    resumeFromOffset(dragRef.current.offset);
  }


  if (testimonials.length === 0) return null;

  /*
   * CIRCULAR LIST — 4 copies so the track is always wider than any viewport.
   * [A,B,C, A,B,C, A,B,C, A,B,C]  (4×)
   * Animate translateX(0) → translateX(-25%)  = exactly one set width.
   * When it resets to 0 it looks identical → seamless, gap-free loop.
   */
  const doubled = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section
      id="testimonials"
      style={{
        position: 'relative',
        width: '100%',
        background:
          'linear-gradient(160deg, #4a0520 0%, #6D0B31 50%, #3d0a1c 100%)',
        padding: '56px 0 52px',
        overflow: 'hidden',
      }}
    >
      {/* 4× track → animate -25% = one set → seamless circular loop */}
      <style>{`
        @keyframes tm-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        .tm-track {
          animation: tm-scroll ${DURATION}s linear infinite;
        }
      `}</style>

      {/* Subtle radial glows */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 10% 40%, rgba(229,154,196,0.14) 0%, transparent 55%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 85% 60%, rgba(143,18,66,0.22) 0%, transparent 55%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Heading: same pattern as other sections, adapted for dark bg ── */}
        <Reveal direction="up">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '0 24px',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background:
                  'linear-gradient(to right, transparent, rgba(244,192,209,0.35))',
              }}
            />
            <h2
              className="shrink-0 font-display text-[40px] font-bold tracking-tight"
              style={{ color: '#f4c0d1' }}
            >
              {t('sections.testimonials.title')}
            </h2>
            <div
              style={{
                flex: 1,
                height: '1px',
                background:
                  'linear-gradient(to left, transparent, rgba(244,192,209,0.35))',
              }}
            />
          </div>
          <p
            style={{
              textAlign: 'center',
              color: 'rgba(244,213,228,0.55)',
              fontSize: '14.5px',
              marginBottom: '40px',
              padding: '0 24px',
            }}
          >
            {t('sections.testimonials.subtitle')}
          </p>
        </Reveal>

        {/* ── Circular carousel ── */}
        <div
          style={{
            overflow: 'hidden',
            width: '100%',
            cursor: isGrabbing ? 'grabbing' : 'grab',
          }}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Side fade masks */}
          <div
            style={{
              position: 'relative',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              userSelect: 'none',
            }}
          >
            {/*
              Track: width = max-content (= 2 × one-set-width because doubled).
              CSS animation moves it -50% → seamless circular loop.
            */}
            <div
              ref={trackRef}
              className="tm-track"
              style={{
                display: 'flex',
                gap: '18px',
                width: 'max-content',
                padding: '8px 0 12px',
                pointerEvents: 'none',
              }}
            >
              {doubled.map((item, i) => (
                <TestimonialCard key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
