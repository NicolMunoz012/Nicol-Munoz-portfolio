import { useEffect, useState } from "react";

/* Comentario: Hook que detecta la dirección del scroll para mostrar u ocultar elementos como la barra de navegación. */
export type ScrollDirection = "up" | "down" | "none";

type UseScrollDirectionOptions = {
  threshold?: number;
};

export function useScrollDirection(
  options: UseScrollDirectionOptions = {},
): ScrollDirection {
  const { threshold = 8 } = options;
  const [direction, setDirection] = useState<ScrollDirection>("none");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateDirection = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY;

      if (Math.abs(delta) < threshold) {
        ticking = false;
        return;
      }

      const nextDirection: ScrollDirection = delta > 0 ? "down" : "up";
      setDirection((prev) => (prev === nextDirection ? prev : nextDirection));
      lastScrollY = current;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return direction;
}


