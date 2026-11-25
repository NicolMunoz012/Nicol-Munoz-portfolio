'use client';

import { useEffect, useState } from "react";

export type GithubRepo = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
  updatedAt: string;
  homepage: string | null;
};

export type GithubOverview = {
  username: string;
  /** Los 6 repos destacados (más estrellas, luego más recientes). */
  repos: GithubRepo[];
  /** Los 30 repos con actividad más reciente. */
  allRepos: GithubRepo[];
};

type State =
  | { status: "loading"; data: null }
  | { status: "success"; data: GithubOverview }
  | { status: "error"; data: null };

// Una sola petición compartida por todas las secciones que la necesitan.
let request: Promise<GithubOverview> | null = null;

function loadOverview(): Promise<GithubOverview> {
  if (!request) {
    request = fetch("/api/github/overview").then((res) => {
      if (!res.ok) throw new Error("github_overview_failed");
      return res.json() as Promise<GithubOverview>;
    });
    // Si falla, la siguiente sección que monte puede reintentar.
    request.catch(() => {
      request = null;
    });
  }
  return request;
}

export function useGithubOverview(): State {
  const [state, setState] = useState<State>({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    loadOverview()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", data: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
