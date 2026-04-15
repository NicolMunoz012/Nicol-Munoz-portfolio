'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../_context/ThemeContext';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Simular carga mínima de 1.5 segundos
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Esperar a que la página esté completamente cargada
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(minLoadTime);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1c122d 0%, #2a1a3d 100%)'
              : 'linear-gradient(135deg, #f9f6ee 0%, #fdf8f0 100%)',
          }}
        >
          {/* Partículas de fondo */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: isDark
                    ? 'rgba(229, 154, 188, 0.3)'
                    : 'rgba(143, 18, 66, 0.2)',
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Contenido central */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo con animación */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative"
            >
              {/* Logo */}
              <motion.div
                className="relative h-28 w-28 overflow-hidden rounded-full shadow-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src="/logo.jpg"
                  alt="Loading"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Indicadores de carga */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Barra de progreso */}
              <div
                className="relative h-1 w-48 overflow-hidden rounded-full"
                style={{
                  background: isDark
                    ? 'rgba(143, 18, 66, 0.2)'
                    : 'rgba(109, 11, 49, 0.15)',
                }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: isDark
                      ? 'linear-gradient(90deg, #8F1242, #E59ABC)'
                      : 'linear-gradient(90deg, #6D0B31, #8F1242)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {/* Puntos animados */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: isDark ? '#8F1242' : '#6D0B31',
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Gradiente radial decorativo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(circle at center, transparent 0%, rgba(28, 18, 45, 0.8) 100%)'
                : 'radial-gradient(circle at center, transparent 0%, rgba(249, 246, 238, 0.8) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
