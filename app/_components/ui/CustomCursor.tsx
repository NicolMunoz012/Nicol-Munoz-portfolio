'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../_context/ThemeContext';

export function CustomCursor() {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for motion
  const springConfigOuter = { damping: 25, stiffness: 200, mass: 0.6 };
  const springConfigInner = { damping: 45, stiffness: 450, mass: 0.1 };
  
  const cursorXSpring = useSpring(cursorX, springConfigOuter);
  const cursorYSpring = useSpring(cursorY, springConfigOuter);
  const cursorXInner = useSpring(cursorX, springConfigInner);
  const cursorYInner = useSpring(cursorY, springConfigInner);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === 'undefined' || isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Cinematic Ring */}
          <motion.div
            className={`fixed top-0 left-0 z-[9999] pointer-events-none ${theme === 'dark' ? 'mix-blend-difference' : 'mix-blend-multiply opacity-80'}`}
            style={{
              translateX: cursorXSpring,
              translateY: cursorYSpring,
              left: -24,
              top: -24,
            }}
            animate={{
              scale: isHovered ? 1.4 : isMouseDown ? 0.8 : 1,
              rotate: isHovered ? 45 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Glow / Ring */}
              <div className={`w-12 h-12 rounded-full border transition-all duration-300 ${
                isHovered 
                  ? 'border-accent bg-accent/20 blur-[1px]' 
                  : 'border-accent/40 bg-accent/10'
              }`} />
              
              {/* Corner Accents for a futuristic/cinematic UI */}
              <motion.div 
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.1 : 0.8 }}
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent rounded-tl-sm shadow-[0_0_8px_rgba(229,154,196,0.5)]" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent rounded-tr-sm shadow-[0_0_8px_rgba(229,154,196,0.5)]" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent rounded-bl-sm shadow-[0_0_8px_rgba(229,154,196,0.5)]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent rounded-br-sm shadow-[0_0_8px_rgba(229,154,196,0.5)]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Sharp Interaction Dot */}
          <motion.div
            className={`fixed top-0 left-0 z-[9999] pointer-events-none ${theme === 'dark' ? 'mix-blend-difference' : ''}`}
            style={{
              translateX: cursorXInner,
              translateY: cursorYInner,
              left: -4,
              top: -4,
            }}
            animate={{
              scale: isHovered ? 0.4 : isMouseDown ? 2 : 1,
            }}
          >
            {/* The dot itself uses specific colors based on the theme */}
            <div 
              className="w-2 h-2 rounded-full transition-colors duration-500 shadow-lg" 
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgb(var(--foreground) / 1)' : 'rgb(var(--accent) / 1)',
                boxShadow: theme === 'dark' 
                  ? '0 0 15px rgba(249, 246, 238, 0.5)' 
                  : '0 0 15px rgba(143, 18, 66, 0.5)' 
              }}
            />
          </motion.div>

          {/* Ambient Trail Glow (Reacts to the Three.js background colors) */}
          <motion.div
            className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-screen"
            style={{
              translateX: cursorXSpring,
              translateY: cursorYSpring,
              left: -60,
              top: -60,
            }}
            animate={{
              scale: isHovered ? 3.5 : 2,
              opacity: isHovered ? 0.25 : 0.1,
            }}
          >
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-radial from-accent/40 via-accent/10 to-transparent blur-3xl" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
