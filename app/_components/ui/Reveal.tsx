"use client";

import { motion } from "framer-motion";
import { useInView } from "../../_hooks/useInView";
import { useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  const offset = directions[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
