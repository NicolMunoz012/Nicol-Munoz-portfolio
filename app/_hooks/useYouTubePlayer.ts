'use client';

import { useCallback, useEffect, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Singletons de módulo: un único reproductor compartido por todos los
// componentes que usan el hook.
// ─────────────────────────────────────────────────────────────────────────────
const PLAYLIST_ID = 'PLts7NU9C3pH3P4UMrAuVUzBptFlW8ZmAH';
const CONTAINER_ID = 'yt-player-singleton';
const PLAYING = 1; // YT.PlayerState.PLAYING (literal: el global YT puede no existir aún)

let playerInstance: YT.Player | null = null;
let playerReady = false;
let apiReady = false;
let apiLoading = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function initPlayer() {
  if (!apiReady || playerInstance || typeof YT === 'undefined') return;

  playerInstance = new YT.Player(CONTAINER_ID, {
    width: 0,
    height: 0,
    playerVars: {
      listType: 'playlist',
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0,
      origin: window.location.origin,
    },
    events: {
      onReady: () => {
        playerReady = true;
        playerInstance?.setShuffle(true);
        notifyListeners();
      },
      onStateChange: notifyListeners,
      onError: notifyListeners,
    },
  });
}

/** Carga la API de YouTube y crea el reproductor oculto. Solo la primera llamada hace algo. */
function ensurePlayer() {
  if (typeof window === 'undefined' || playerInstance) return;

  if (!document.getElementById(CONTAINER_ID)) {
    const div = document.createElement('div');
    div.id = CONTAINER_ID;
    div.style.position = 'absolute';
    div.style.width = '0';
    div.style.height = '0';
    div.style.overflow = 'hidden';
    div.style.pointerEvents = 'none';
    div.setAttribute('aria-hidden', 'true');
    document.body.appendChild(div);
  }

  if (apiReady) {
    initPlayer();
    return;
  }
  if (apiLoading) return;
  apiLoading = true;

  (window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady = () => {
    apiReady = true;
    apiLoading = false;
    initPlayer();
    notifyListeners();
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

export interface YouTubePlayerState {
  /** El reproductor terminó de cargar y acepta órdenes. */
  isLoaded: boolean;
  isPlaying: boolean;
  currentTitle: string;
  currentChannel: string;
  progress: number; // 0–1
  toggle: () => void;
  next: () => void;
  prev: () => void;
}

/**
 * @param enabled Mientras sea false no se descarga nada de YouTube. Pásalo a
 * true cuando la persona abre el reproductor por primera vez.
 */
export function useYouTubePlayer(enabled: boolean): YouTubePlayerState {
  const [, setTick] = useState(0);

  useEffect(() => {
    const rerender = () => setTick((n) => n + 1);
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  }, []);

  useEffect(() => {
    if (enabled) ensurePlayer();
  }, [enabled]);

  let isPlaying = false;
  let currentTitle = '';
  let currentChannel = '';
  let progress = 0;

  if (playerReady && playerInstance) {
    try {
      isPlaying = playerInstance.getPlayerState() === PLAYING;
      const videoData = playerInstance.getVideoData?.();
      currentTitle = videoData?.title ?? '';
      currentChannel = videoData?.author ?? '';

      const duration = playerInstance.getDuration?.() ?? 0;
      const current = playerInstance.getCurrentTime?.() ?? 0;
      progress = duration > 0 ? Math.min(1, current / duration) : 0;
    } catch {
      // El iframe aún no responde: se mantienen los valores por defecto.
    }
  }

  // Mientras suena, refresca el progreso dos veces por segundo.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setTick((n) => n + 1), 500);
    return () => clearInterval(id);
  }, [isPlaying]);

  const toggle = useCallback(() => {
    if (!playerReady || !playerInstance) return;
    if (playerInstance.getPlayerState() === PLAYING) playerInstance.pauseVideo();
    else playerInstance.playVideo();
    notifyListeners();
  }, []);

  const next = useCallback(() => {
    if (!playerReady) return;
    playerInstance?.nextVideo();
    notifyListeners();
  }, []);

  const prev = useCallback(() => {
    if (!playerReady) return;
    playerInstance?.previousVideo();
    notifyListeners();
  }, []);

  return { isLoaded: playerReady, isPlaying, currentTitle, currentChannel, progress, toggle, next, prev };
}
