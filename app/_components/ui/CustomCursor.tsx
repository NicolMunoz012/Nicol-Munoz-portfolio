'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from '../../_hooks/useMediaQuery';

const INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], [role="tab"], summary, label, select, [data-cursor="hover"]';

// Casi crítico: el anillo alcanza al puntero en ~0,1 s sin rebotar.
const RING_SPRING = { stiffness: 1500, damping: 50, mass: 0.4 };

const CORNERS = [
  'top-0 left-0 border-t-2 border-l-2 rounded-tl-sm',
  'top-0 right-0 border-t-2 border-r-2 rounded-tr-sm',
  'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-sm',
  'bottom-0 right-0 border-b-2 border-r-2 rounded-br-sm',
];

export function CustomCursor() {
  // Solo donde hay mouse o trackpad; en pantallas táctiles no tiene sentido.
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine)');

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const visibleRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);

  // El punto se escribe directo en el DOM (1:1 con el puntero, sin pasar por
  // React ni por resortes); x/y solo alimentan el resorte del anillo.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, RING_SPRING);
  const ringY = useSpring(y, RING_SPRING);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add('custom-cursor');

    const show = (next: boolean) => {
      if (visibleRef.current === next) return;
      visibleRef.current = next;
      setVisible(next);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visibleRef.current) {
        // Al reaparecer, el anillo no debe cruzar la pantalla desde su última posición.
        ringX.jump(e.clientX);
        ringY.jump(e.clientY);
        show(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      setHovering(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => show(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('blur', onLeave);
    root.addEventListener('mouseleave', onLeave);

    return () => {
      root.classList.remove('custom-cursor');
      visibleRef.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('blur', onLeave);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, x, y, ringX, ringY]);

  if (!enabled) return null;

  const ringScale = hovering ? 'scale-[1.4] rotate-45' : pressed ? 'scale-[0.8]' : 'scale-100';
  const dotScale = hovering ? 'scale-[0.5]' : pressed ? 'scale-[1.8]' : 'scale-100';

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-150 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Anillo */}
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <div
          className={`relative -ml-6 -mt-6 h-12 w-12 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${ringScale}`}
        >
          <div
            className={`h-full w-full rounded-full border transition-colors duration-150 ${
              hovering ? 'border-accent bg-accent/20' : 'border-accent/50 bg-accent/10'
            }`}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-150 ${
              hovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {CORNERS.map((corner) => (
              <span key={corner} className={`absolute h-2 w-2 border-accent ${corner}`} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Punto: es el puntero real, por eso no lleva resorte */}
      <div ref={dotRef} className="absolute left-0 top-0 will-change-transform" style={{ transform: 'translate3d(-100px, -100px, 0)' }}>
        <div
          className={`cursor-dot -ml-1 -mt-1 h-2 w-2 rounded-full transition-transform duration-150 ease-out ${dotScale}`}
        />
      </div>
    </div>
  );
}
