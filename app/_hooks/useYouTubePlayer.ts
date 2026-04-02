'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-LEVEL SINGLETONS – shared across every component that calls the hook
// ─────────────────────────────────────────────────────────────────────────────
let playerInstance: YT.Player | null = null;
let apiReady = false;
let apiLoading = false;
const listeners = new Set<() => void>(); // components waiting for state changes

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function loadYouTubeAPI() {
  if (apiReady || apiLoading || typeof window === 'undefined') return;
  apiLoading = true;

  // Called by YouTube when the script finishes loading
  (window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady = () => {
    apiReady = true;
    apiLoading = false;
    notifyListeners();
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

function initPlayer(containerId: string) {
  if (!apiReady || playerInstance || typeof YT === 'undefined') return;

  playerInstance = new YT.Player(containerId, {
    width: 0,
    height: 0,
    playerVars: {
      listType: 'playlist',
      list: 'PLts7NU9C3pH3P4UMrAuVUzBptFlW8ZmAH',
      autoplay: 0,
      controls: 0,
    },
    events: {
      onReady: () => {
        playerInstance?.setShuffle(true);
        notifyListeners();
      },
      onStateChange: () => {
        notifyListeners();
      },
      onError: () => {
        notifyListeners();
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────
export interface YouTubePlayerState {
  isReady: boolean;
  isPlaying: boolean;
  currentTitle: string;
  currentChannel: string;
  progress: number; // 0–1
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
}

/** Unique id for the hidden iframe container element */
const CONTAINER_ID = 'yt-player-singleton';

export function useYouTubePlayer(): YouTubePlayerState {
  const [tick, setTick] = useState(0); // triggers re-render on state changes
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Subscribe to singleton change events
  useEffect(() => {
    const rerender = () => setTick((n) => n + 1);
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  }, []);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ensure the hidden container div exists in the DOM
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

    if (!apiReady) {
      loadYouTubeAPI();
    } else {
      // API was already ready (another component loaded it first)
      initPlayer(CONTAINER_ID);
    }
  }, []);

  // Init player once API is ready
  useEffect(() => {
    if (apiReady && !playerInstance) {
      initPlayer(CONTAINER_ID);
    }
  }, [tick]);

  // Progress interval
  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => setTick((n) => n + 1), 500);
    };
    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const state = playerInstance?.getPlayerState?.();
    // YT.PlayerState.PLAYING === 1 — use literal to avoid ReferenceError before API loads
    if (state === 1) {
      startInterval();
    } else {
      stopInterval();
    }

    return stopInterval;
  });

  // ── Derived state ───────────────────────────────────────────────────────────
  const playerState = playerInstance?.getPlayerState?.();
  // YT.PlayerState.PLAYING === 1
  const isPlaying = playerState === 1;

  let currentTitle = '';
  let currentChannel = '';
  let progress = 0;

  try {
    const videoData = playerInstance?.getVideoData?.();
    currentTitle = videoData?.title ?? '';
    currentChannel = videoData?.author ?? '';

    const duration = playerInstance?.getDuration?.() ?? 0;
    const current = playerInstance?.getCurrentTime?.() ?? 0;
    progress = duration > 0 ? current / duration : 0;
  } catch {
    // player not ready yet
  }

  const isReady = Boolean(playerInstance && playerState !== undefined && playerState !== -1);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const play = useCallback(() => {
    playerInstance?.playVideo();
    notifyListeners();
  }, []);

  const pause = useCallback(() => {
    playerInstance?.pauseVideo();
    notifyListeners();
  }, []);

  const toggle = useCallback(() => {
    // YT.PlayerState.PLAYING === 1
    if (playerInstance?.getPlayerState() === 1) {
      playerInstance.pauseVideo();
    } else {
      playerInstance?.playVideo();
    }
    notifyListeners();
  }, []);

  const next = useCallback(() => {
    playerInstance?.nextVideo();
    notifyListeners();
  }, []);

  const prev = useCallback(() => {
    playerInstance?.previousVideo();
    notifyListeners();
  }, []);

  return {
    isReady,
    isPlaying,
    currentTitle,
    currentChannel,
    progress,
    play,
    pause,
    toggle,
    next,
    prev,
  };
}
