import { useEffect, useState, RefObject } from "react";

type UseInViewOptions = {
  once?: boolean;
  margin?: string;
  threshold?: number;
};

export function useInView(
  ref: RefObject<Element | null>,
  { once = false, margin = "0px", threshold = 0.1 }: UseInViewOptions = {}
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        if (inView && once) {
          observer.unobserve(element);
        }
      },
      {
        rootMargin: margin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, once, margin, threshold]);

  return isInView;
}
