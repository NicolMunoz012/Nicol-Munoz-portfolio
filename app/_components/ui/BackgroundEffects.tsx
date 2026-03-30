'use client';

import { motion } from 'framer-motion';

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary Animated Gradient */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Animated Gradient */}
      <motion.div
        className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-dark/20 blur-[100px]"
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tertiary Animated Gradient */}
      <motion.div
        className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[110px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Grid Pattern (Optional subtle detail) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
