'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '../../_context/LanguageContext';
import { useTheme } from '../../_context/ThemeContext';
import { IconButton } from '../ui/IconButton';
import { X, Moon, Sun, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const SOCIAL_LINKS = [
  { icon: <FaGithub size={18} />, href: "https://github.com/NicolMunoz012", label: "GitHub" },
  { icon: <FaLinkedin size={18} />, href: "https://linkedin.com/in/nicol-munoz", label: "LinkedIn" },
  { icon: <Mail size={18} />, href: "mailto:nicol@email.com", label: "Email" },
];

const NAV_ITEMS: {
  href: string;
  key: "about" | "projects" | "testimonials" | "experience" | "contact";
}[] = [
  { href: "#about", key: "about" },
  { href: "#projects", key: "projects" },
  { href: "#testimonials", key: "testimonials" },
  { href: "#experience", key: "experience" },
  { href: "#contact", key: "contact" },
];

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 z-50 flex w-full flex-col bg-surface py-8 shadow-2xl overflow-hidden"
          >
            {/* Background Decor - SVG Pattern */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.05] dark:opacity-[0.03]">
              <svg 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none" 
                className="absolute inset-0 h-full w-full fill-none stroke-accent"
                strokeWidth="0.1"
              >
                <motion.path
                  d="M0,20 Q50,0 100,20 V80 Q50,100 0,80 Z"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M10,30 Q50,15 90,30 V70 Q50,85 10,70 Z"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
                />
                <motion.circle cx="50" cy="50" r="40" strokeDasharray="2,2" />
                <motion.line x1="0" y1="50" x2="100" y2="50" strokeDasharray="1,1" />
              </svg>
            </div>

            {/* Header in Menu */}
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10">
              <div className="mb-12 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  
                 {/* Logo izquierdo */}
                  <div className="flex items-center">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full">
                      <img
                        src="/logo.jpg"
                        alt="Nicol Muñoz"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Availability Status */}
                  <div className="flex items-center gap-2 rounded-full bg-surface-2/40 px-3 py-1.5 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">
                      {locale === 'en' ? 'Available' : 'Disponible'}
                    </span>
                  </div>
                </div>
                <IconButton
                  label="Close menu"
                  onClick={onClose}
                  className="h-10 w-10 rounded-full bg-[#6D0B31]/15 p-0 text-foreground backdrop-blur-sm hover:bg-[#6D0B31]/30"
                  icon={<X size={20} />}
                />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 flex flex-1 flex-col justify-center gap-6">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.key}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="group"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-6"
                  >
                    <span className="font-display text-sm font-bold text-accent/50 group-hover:text-accent">
                      0{index + 1}
                    </span>
                    <span className="font-display text-4xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-5xl lg:text-6xl">
                      {t(`nav.${item.key}`)}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer in Menu (Controls + Socials) */}
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 mt-auto flex flex-col gap-8 relative z-10 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-6">
                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {SOCIAL_LINKS.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D0B31]/15 text-foreground backdrop-blur-sm transition-all hover:bg-[#6D0B31]/30 hover:text-accent shadow-sm"
                      whileHover={{ y: -4, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>

                {/* Theme & Language Controls */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="flex h-10 min-w-[56px] items-center justify-center rounded-xl bg-[#6D0B31]/15 px-4 text-[11px] font-bold uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:bg-[#6D0B31]/30 hover:text-accent"
                  >
                    {locale.toUpperCase()}
                  </button>

                  <IconButton
                    label="Toggle theme"
                    onClick={toggleTheme}
                    className="h-10 w-10 rounded-xl bg-[#6D0B31]/15 p-0 text-foreground backdrop-blur-sm hover:bg-[#6D0B31]/30"
                    icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  />
                </div>
              </div>
              
              <div className="flex justify-center border-t border-[#6D0B31]/15 pt-4">
                <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 font-bold">
                  © {new Date().getFullYear()} {t("nav.name")}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
