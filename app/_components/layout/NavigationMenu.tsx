'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Image from 'next/image';
import { X, Moon, Sun, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useLanguage } from '../../_context/LanguageContext';
import { useTheme } from '../../_context/ThemeContext';
import { SOCIAL_LINKS } from '../../_lib/links';
import { trapFocus } from '../../_lib/a11y';

const SOCIALS = [
  { icon: <FaGithub size={18} aria-hidden />, href: SOCIAL_LINKS.github, label: 'GitHub', external: true },
  { icon: <FaLinkedin size={18} aria-hidden />, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn', external: true },
  { icon: <Mail size={18} aria-hidden />, href: SOCIAL_LINKS.email, label: 'Email', external: false },
];

const NAV_ITEMS = [
  { href: '#about', key: 'about' },
  { href: '#projects', key: 'projects' },
  { href: '#testimonials', key: 'testimonials' },
  { href: '#experience', key: 'experience' },
  { href: '#skills', key: 'skills' },
  { href: '#contact', key: 'contact' },
] as const;

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    x: '-100%',
    transition: { type: 'spring', stiffness: 400, damping: 40, staggerChildren: 0.05, staggerDirection: -1 },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 400, damping: 40, staggerChildren: 0.06, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0 },
};

const control =
  'flex h-11 items-center justify-center rounded-xl bg-primary-dark/15 text-foreground transition-colors hover:bg-primary-dark/30 hover:text-accent';

interface NavigationMenuProps {
  isOpen: boolean;
  /** `restoreFocus`: devolver el foco al botón que abrió el menú. */
  onClose: (restoreFocus: boolean) => void;
}

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              onClose(true);
            } else if (panelRef.current) {
              trapFocus(event, panelRef.current);
            }
          }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background/85 py-8"
        >
          {/* Trazos decorativos */}
          <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.05] dark:opacity-[0.03]">
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
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
              <motion.path
                d="M10,30 Q50,15 90,30 V70 Q50,85 10,70 Z"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2.5, delay: 0.5, ease: 'easeInOut' }}
              />
              <circle cx="50" cy="50" r="40" strokeDasharray="2,2" />
              <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="1,1" />
            </svg>
          </div>

          {/* Cabecera */}
          <div className="relative z-10 mx-auto mb-10 flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image src="/logo.jpg" alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex items-center gap-2 rounded-full bg-card-2/60 px-3 py-1.5">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                  {t('nav.available')}
                </span>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => onClose(true)}
              aria-label={t('nav.closeMenu')}
              className={`${control} w-11 rounded-full`}
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          {/* Enlaces */}
          <nav
            aria-label={t('nav.menu')}
            className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-4 px-4 sm:gap-3 sm:px-6 lg:gap-5 lg:px-10"
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.div key={item.key} variants={itemVariants}>
                <a
                  href={item.href}
                  onClick={() => onClose(false)}
                  className="group flex w-fit items-center gap-5 transition-transform duration-200 ease-out hover:translate-x-2.5 sm:gap-4 lg:gap-6"
                >
                  <span aria-hidden className="font-display text-sm font-bold text-accent/80 group-hover:text-accent">
                    0{index + 1}
                  </span>
                  <span className="font-display text-[2.5rem] font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-[clamp(1.5rem,4.5vw,3rem)]">
                    {t(`nav.${item.key}`)}
                  </span>
                </a>
              </motion.div>
            ))}
          </nav>

          {/* Controles y redes */}
          <div className="relative z-10 mx-auto mt-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-8 sm:px-6 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={social.label}
                    className={`${control} w-11 transition-[background-color,color,translate] hover:-translate-y-1`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
                  aria-label={t('nav.switchLanguage')}
                  className={`${control} min-w-14 px-4 text-xs font-bold uppercase tracking-widest`}
                >
                  <span aria-hidden>{locale.toUpperCase()}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
                  className={`${control} w-11`}
                >
                  {theme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
                </button>
              </div>
            </div>

            <p className="border-t border-primary-dark/20 pt-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
              © {new Date().getFullYear()} {t('nav.name')}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
