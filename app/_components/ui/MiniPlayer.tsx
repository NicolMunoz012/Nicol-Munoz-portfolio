'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X } from 'lucide-react';
import { useLanguage } from '../../_context/LanguageContext';
import { useYouTubePlayer } from '../../_hooks/useYouTubePlayer';
import { PlayerControls } from './PlayerControls';

const PANEL_ID = 'mini-player-panel';

export function MiniPlayer() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  // YouTube no se descarga hasta que se abre el reproductor por primera vez.
  const [hasOpened, setHasOpened] = useState(false);
  const player = useYouTubePlayer(hasOpened);

  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={PANEL_ID}
            role="region"
            aria-label={t('player.playlist')}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-[min(260px,calc(100vw-3rem))] rounded-3xl border-2 border-primary-dark/40 bg-card/90 p-4 shadow-xl backdrop-blur-md"
          >
            <PlayerControls player={player} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={isOpen ? t('player.close') : t('player.open')}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        onClick={() => {
          setHasOpened(true);
          setIsOpen((open) => !open);
        }}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark text-primary-foreground shadow-lg transition-[scale] hover:scale-110 active:scale-95"
      >
        {isOpen ? <X size={20} strokeWidth={2.5} aria-hidden /> : <Music size={22} aria-hidden />}
      </button>
    </div>
  );
}
