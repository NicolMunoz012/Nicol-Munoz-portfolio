'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLanguage } from '../_context/LanguageContext';
import { getTranslationArray } from '../_i18n';
import { Reveal } from '../_components/ui/Reveal';

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

const COPIES = 4; // suficientes copias para llenar cualquier pantalla sin huecos
const SPEED = 33; // px por segundo (independiente de los Hz de la pantalla)
const DRAG_THRESHOLD = 6; // px antes de considerar que el gesto es un arrastre
const STEP = 318; // ancho de tarjeta + separación, para las flechas del teclado

function TestimonialCard({ item }: { item: Testimonial }) {
  const author = item.author.replace(/^[—-]\s*/, '');
  const initials = author
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure className="flex w-[min(300px,78vw)] shrink-0 flex-col gap-4 rounded-[20px] border border-band-heading/20 bg-white/5 px-5 pb-5 pt-6 shadow-lg">
      <span aria-hidden className="-mb-3 block font-serif text-[40px] leading-none text-band-heading/50">
        &ldquo;
      </span>
      <blockquote className="grow text-[15px] leading-relaxed text-band-foreground/90">
        {item.quote}
      </blockquote>
      <div aria-hidden className="h-px bg-linear-to-r from-transparent via-band-heading/25 to-transparent" />
      <figcaption className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-band-heading/30 bg-linear-to-br from-[#8f1242] to-[#6d0b31] text-xs font-bold tracking-wide text-band-foreground"
        >
          {initials}
        </span>
        <span className="flex flex-col gap-0.5 leading-tight">
          <span className="text-sm font-bold text-band-foreground">{author}</span>
          <span className="text-xs text-band-foreground/75">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const { locale, t } = useLanguage();
  const testimonials = getTranslationArray(locale, 'testimonials.items') as Testimonial[];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0); // desplazamiento actual en px

  // Motivos para detener el avance automático. Se leen dentro del bucle de animación.
  const pausedByUser = useRef(false);
  const hovering = useRef(false);
  const focused = useRef(false);
  const drag = useRef({ pointerId: -1, startX: 0, lastX: 0, dragging: false });

  const [userPaused, setUserPaused] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  /** Mueve la pista `dx` px (positivo = avanza) manteniendo el bucle infinito. */
  const shift = useCallback((dx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const loopWidth = track.scrollWidth / COPIES;
    if (loopWidth <= 0) return;
    offsetRef.current = (((offsetRef.current + dx) % loopWidth) + loopWidth) % loopWidth;
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  // Avance automático: solo corre mientras el carrusel está en pantalla.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || testimonials.length === 0) return;

    let frame = 0;
    let last = 0;
    let visible = false;

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 0;
      last = now;
      const stopped =
        pausedByUser.current || hovering.current || focused.current || drag.current.pointerId !== -1;
      if (!stopped) shift((SPEED * dt) / 1000);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(wrapper);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [testimonials.length, shift]);

  /* ── Arrastre con pointer events (mouse, táctil y lápiz) ──
     `touch-action: pan-y` deja el scroll vertical al navegador: si el gesto
     es vertical llega `pointercancel` y el arrastre se suelta solo. */
  function endDrag() {
    drag.current.pointerId = -1;
    drag.current.dragging = false;
    setIsGrabbing(false);
  }

  if (testimonials.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-2 py-6 sm:px-3">
      <section
        id="testimonials"
        aria-labelledby="testimonials-title"
        className="testimonial-band relative overflow-hidden rounded-3xl pb-10 pt-14"
      >
        <div className="relative">
          <Reveal direction="up">
            <div className="mx-auto mb-2.5 flex w-full max-w-[1000px] items-center gap-5 px-6">
              <div aria-hidden className="h-px flex-1 bg-linear-to-r from-transparent to-band-heading/35" />
              <h2
                id="testimonials-title"
                className="shrink-0 font-display text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-tight text-band-heading"
              >
                {t('sections.testimonials.title')}
              </h2>
              <div aria-hidden className="h-px flex-1 bg-linear-to-l from-transparent to-band-heading/35" />
            </div>
            <p className="mb-10 px-6 text-center text-[15.5px] text-band-foreground/80">
              {t('sections.testimonials.subtitle')}
            </p>
          </Reveal>

          <div
            ref={wrapperRef}
            role="group"
            aria-roledescription="carousel"
            aria-label={t('testimonials.carouselLabel')}
            tabIndex={0}
            className={`touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] ${
              isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') hovering.current = true;
            }}
            onPointerLeave={() => {
              hovering.current = false;
              // Soltar fuera sin haber arrastrado no dispara pointerup aquí.
              if (!drag.current.dragging) drag.current.pointerId = -1;
            }}
            onFocus={() => {
              focused.current = true;
            }}
            onBlur={() => {
              focused.current = false;
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') shift(STEP);
              else if (e.key === 'ArrowLeft') shift(-STEP);
              else return;
              e.preventDefault();
            }}
            onPointerDown={(e) => {
              if (e.pointerType === 'mouse' && e.button !== 0) return;
              drag.current = { pointerId: e.pointerId, startX: e.clientX, lastX: e.clientX, dragging: false };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (d.pointerId !== e.pointerId) return;
              if (!d.dragging) {
                if (Math.abs(e.clientX - d.startX) < DRAG_THRESHOLD) return;
                d.dragging = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsGrabbing(true);
              }
              shift(d.lastX - e.clientX);
              d.lastX = e.clientX;
            }}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={(e) => {
              // En táctil, capturar aquí hace que la tarjeta pierda su captura implícita
              // y ese evento burbujea: solo cuenta cuando la pierde este contenedor.
              if (e.target === e.currentTarget) endDrag();
            }}
          >
            <div ref={trackRef} className="flex w-max gap-[18px] py-2 will-change-transform">
              {Array.from({ length: COPIES }, (_, copy) => (
                // Las copias solo existen para el bucle visual: se ocultan a lectores de pantalla.
                <div key={copy} className="flex gap-[18px]" aria-hidden={copy > 0}>
                  {testimonials.map((item) => (
                    <TestimonialCard key={item.author} item={item} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
              <button
                type="button"
                aria-label={userPaused ? t('testimonials.play') : t('testimonials.pause')}
                onClick={() => {
                  pausedByUser.current = !userPaused;
                  setUserPaused(!userPaused);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-band-heading/30 bg-white/5 text-band-heading transition-colors hover:bg-white/15"
              >
                {userPaused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
              </button>
            </div>
        </div>
      </section>
    </div>
  );
}
