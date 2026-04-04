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

      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(244,192,209,0.25), transparent)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8F1242 0%, #6D0B31 100%)',
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

/* ── Constants ── */
const COPIES = 4;   // enough copies to fill any viewport without gaps
const SPEED = 0.55; // px per frame (auto-scroll speed)

/* ── Main section ── */
export function TestimonialsSection() {
  const { locale, t } = useLanguage();
  const testimonials = getTranslationArray(
    locale,
    'testimonials.items',
  ) as Testimonial[];

  const wrapperRef = useRef<HTMLDivElement>(null); // the overflow:hidden container
  const trackRef  = useRef<HTMLDivElement>(null);  // the moving flex row
  const rafRef    = useRef<number | null>(null);
  const offsetRef = useRef(0);                     // current translateX offset (px)
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Drag state — kept in a ref so RAF closure always sees the latest value
  const drag = useRef({ active: false, lastX: 0 });

  /* ──────────────────────────────────────────────────────────────
     RAF loop — runs forever; when dragging, the loop still runs
     but drag's onMove updates offsetRef directly, so it stays in
     sync and resumes seamlessly when drag ends.
  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || testimonials.length === 0) return;

    function tick() {
      // Auto-advance only when not dragging
      if (!drag.current.active) {
        const W = track!.scrollWidth / COPIES;
        if (W > 0) {
          offsetRef.current = (offsetRef.current + SPEED) % W;
        }
      }
      track!.style.transform = `translateX(-${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [testimonials.length]);

  /* ──────────────────────────────────────────────────────────────
     Non-passive touchmove — MUST be registered imperatively so
     e.preventDefault() can block the browser's page scroll while
     the user swipes horizontally. React synthetic events are
     passive by default and cannot call preventDefault().
  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    function handleTouchMove(e: TouchEvent) {
      if (!drag.current.active) return;
      e.preventDefault(); // stop page from scrolling vertically
      const dx = drag.current.lastX - e.touches[0].clientX;
      drag.current.lastX = e.touches[0].clientX;
      const W = track!.scrollWidth / COPIES;
      if (W > 0) {
        offsetRef.current = ((offsetRef.current + dx) % W + W) % W;
      }
    }

    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => wrapper.removeEventListener('touchmove', handleTouchMove);
  }, []);

  /* ── Mouse drag ── */
  function onMouseDown(e: React.MouseEvent) {
    drag.current.active = true;
    drag.current.lastX  = e.clientX;
    setIsGrabbing(true);
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!drag.current.active || !trackRef.current) return;
    const dx = drag.current.lastX - e.clientX;
    drag.current.lastX = e.clientX;
    const W = trackRef.current.scrollWidth / COPIES;
    if (W > 0) {
      offsetRef.current = ((offsetRef.current + dx) % W + W) % W;
    }
  }
  function stopDrag() {
    drag.current.active = false;
    setIsGrabbing(false);
  }

  /* ── Touch start / end (move handled imperatively above) ── */
  function onTouchStart(e: React.TouchEvent) {
    drag.current.active = true;
    drag.current.lastX  = e.touches[0].clientX;
  }

  if (testimonials.length === 0) return null;

  // 4 copies → track is always wider than any screen → no empty gaps
  const looped = Array.from({ length: COPIES }, () => testimonials).flat();

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
        {/* Heading */}
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

        {/* ── Infinite circular carousel ── */}
        <div
          ref={wrapperRef}
          style={{
            overflow: 'hidden',
            width: '100%',
            cursor: isGrabbing ? 'grabbing' : 'grab',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={onTouchStart}
          onTouchEnd={stopDrag}
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
            {/* Track — RAF moves this via translateX */}
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                gap: '18px',
                width: 'max-content',
                padding: '8px 0 12px',
                pointerEvents: 'none',
                willChange: 'transform',
              }}
            >
              {looped.map((item, i) => (
                <TestimonialCard key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}







