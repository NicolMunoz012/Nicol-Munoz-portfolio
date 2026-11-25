'use client';

import { useLanguage } from '../../_context/LanguageContext';
import type { YouTubePlayerState } from '../../_hooks/useYouTubePlayer';

function Marquee({ text, className }: { text: string; className: string }) {
  if (text.length <= 24) {
    return <span className={`marquee ${className}`}>{text}</span>;
  }
  return (
    <span className={`marquee ${className}`}>
      <span className="marquee-track">
        <span>{text}</span>
        <span aria-hidden>{text}</span>
      </span>
    </span>
  );
}

const skipButton =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-dark/15 text-accent transition-[background-color,scale] hover:bg-primary-dark/30 active:scale-90 disabled:opacity-50 disabled:active:scale-100';

/** Título, controles y progreso del reproductor. Lo comparten el panel flotante y "Sobre mí". */
export function PlayerControls({ player }: { player: YouTubePlayerState }) {
  const { t } = useLanguage();
  const title = player.currentTitle || (player.isLoaded ? t('player.playlist') : t('player.loading'));

  return (
    <div>
      <div className="mb-3 overflow-hidden" aria-live="polite">
        <Marquee text={title} className="text-sm font-semibold text-foreground" />
        {player.currentChannel && (
          <Marquee text={player.currentChannel} className="mt-0.5 text-xs text-foreground/70" />
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label={t('player.previous')}
          onClick={player.prev}
          disabled={!player.isLoaded}
          className={skipButton}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>

        <button
          type="button"
          aria-label={player.isPlaying ? t('player.pause') : t('player.play')}
          onClick={player.toggle}
          disabled={!player.isLoaded}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark text-primary-foreground shadow-lg transition-[scale,opacity] hover:scale-105 active:scale-90 disabled:opacity-50 disabled:hover:scale-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {player.isPlaying ? <path d="M6 19h4V5H6zm8-14v14h4V5z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>

        <button
          type="button"
          aria-label={t('player.next')}
          onClick={player.next}
          disabled={!player.isLoaded}
          className={skipButton}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-primary/20" aria-hidden>
        <div
          className="h-full origin-left rounded-full bg-linear-to-r from-primary to-accent transition-transform duration-500 ease-linear"
          style={{ transform: `scaleX(${player.progress})` }}
        />
      </div>
    </div>
  );
}
