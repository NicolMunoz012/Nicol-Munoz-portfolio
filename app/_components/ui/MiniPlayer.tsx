'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useYouTubePlayer } from '../../_hooks/useYouTubePlayer';

// ── Marquee CSS (injected once) ───────────────────────────────────────────────
const marqueeStyle = `
@keyframes yt-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.yt-marquee-track {
  display: flex;
  width: max-content;
  animation: yt-marquee 14s linear infinite;
}
`;

function MarqueeText({ text, className = '' }: { text: string; className?: string }) {
  const long = text.length > 24;
  return (
    <span
      style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}
    >
      {long ? (
        <span className="yt-marquee-track">
          <span className={className} style={{ paddingRight: '3rem' }}>{text}</span>
          <span className={className} style={{ paddingRight: '3rem' }} aria-hidden>{text}</span>
        </span>
      ) : (
        <span className={className}>{text}</span>
      )}
    </span>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      style={{
        height: '3px',
        width: '100%',
        borderRadius: '9999px',
        background: 'rgba(143,18,66,0.18)',
        overflow: 'hidden',
        marginTop: '0.5rem',
      }}
    >
      <motion.div
        style={{
          height: '100%',
          borderRadius: '9999px',
          background: 'linear-gradient(90deg,#8F1242,#b31955)',
          originX: 0,
        }}
        animate={{ scaleX: progress }}
        transition={{ duration: 0.4, ease: 'linear' }}
      />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '9999px',
  border: 'none',
  background: 'rgba(143,18,66,0.15)',
  color: '#8F1242',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.18s',
};

const playBtnStyle: React.CSSProperties = {
  ...btnStyle,
  width: '40px',
  height: '40px',
  background: 'linear-gradient(135deg, #8F1242, #6D0B31)',
  color: 'white',
  boxShadow: '0 2px 12px rgba(143,18,66,0.35)',
};

export function MiniPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const { isReady, isPlaying, currentTitle, currentChannel, progress, toggle, next, prev } =
    useYouTubePlayer();

  const title = currentTitle || (isReady ? 'Cargando…' : 'Playlist de YouTube');
  const channel = currentChannel || '';

  return (
    <>
      {/* Inject marquee keyframes once */}
      <style>{marqueeStyle}</style>

      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.75rem',
        }}
      >
        {/* ── Expanded panel ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="miniplayer-panel"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{
                width: '260px',
                borderRadius: '1.5rem',
                padding: '1rem 1.1rem 0.9rem',
                border: '2px solid rgba(109,11,49,0.4)',
                boxShadow:
                  '0 8px 32px rgba(143,18,66,0.18), 0 2px 8px rgba(0,0,0,0.22)',
                backdropFilter: 'blur(12px)',
                background: 'rgba(var(--color-surface-rgb, 20,8,14),0.88)',
              }}
            >
              {/* Track info */}
              <div style={{ marginBottom: '0.65rem', overflow: 'hidden' }}>
                <MarqueeText
                  text={title}
                  className="text-[13px] font-semibold text-foreground"
                />
                {channel && (
                  <MarqueeText
                    text={channel}
                    className="text-[11px] text-foreground/60 mt-0.5"
                  />
                )}
              </div>

              {/* Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <motion.button
                  type="button"
                  aria-label="Anterior"
                  onClick={prev}
                  style={btnStyle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                  </svg>
                </motion.button>

                <motion.button
                  type="button"
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  onClick={toggle}
                  style={playBtnStyle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isPlaying ? (
                      <motion.svg
                        key="pause"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.15 }}
                        width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                      >
                        <path d="M6 19h4V5H6zm8-14v14h4V5z" />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="play"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.15 }}
                        width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  type="button"
                  aria-label="Siguiente"
                  onClick={next}
                  style={btnStyle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
                  </svg>
                </motion.button>
              </div>

              {/* Progress bar */}
              <ProgressBar progress={progress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Toggle button ────────────────────────────────────────────────── */}
        <motion.button
          type="button"
          aria-label={isOpen ? 'Cerrar reproductor' : 'Abrir reproductor de música'}
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #8F1242, #6D0B31)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 4px 20px rgba(143,18,66,0.45), 0 2px 8px rgba(0,0,0,0.25)',
            flexShrink: 0,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close-icon"
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="music-icon"
                initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {/* Music note */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18V6l12-2v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
