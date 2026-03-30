'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";

type GithubRepo = {
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
};

type GithubCommit = {
  repo: string;
  sha: string;
  message: string;
  url: string;
  createdAt: string;
};

type GithubOverview = {
  username: string;
  repos: GithubRepo[];
  commits: GithubCommit[];
};

function formatRelativeDate(dateIso: string) {
  const d = new Date(dateIso);
  const now = Date.now();
  const diff = Math.max(0, now - d.getTime());
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m`;
  if (hours < 48) return `${hours}h`;
  return `${days}d`;
}

export function ProjectsSection() {
  const { t } = useLanguage();
  const [data, setData] = useState<GithubOverview | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const res = await fetch("/api/github/overview");
        if (!res.ok) throw new Error("github_overview_failed");
        const json = (await res.json()) as GithubOverview;
        if (!cancelled) {
          setData(json);
          setStatus("success");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredRepos = useMemo(() => data?.repos ?? [], [data]);
  const recentCommits = useMemo(() => data?.commits ?? [], [data]);

  return (
    <section id="projects" className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-10 py-16">
      {/* Línea superior decorativa */}
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      {/* Encabezado */}
      <Reveal direction="up">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Líneas decorativas */}
          <div className="relative w-full max-w-4xl">
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#6D0B31]/30 to-transparent" />
            
            {/* Título */}
            <h2 className="relative z-10 mx-auto inline-block bg-background px-8 font-display text-[40px] font-bold tracking-tight text-[#6D0B31]">
              {t("sections.projects.title")}
            </h2>
          </div>
        </div>
      </Reveal>
      <Reveal direction="up" delay={0.15}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface/50 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between gap-4 border-b border-border/70 px-6 py-5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                  {t("projects.githubFeatured")}
                </span>
                <span className="font-display text-xl font-bold text-foreground">
                  {t("projects.mainProjects")}
                </span>
              </div>
              <a
                href="https://github.com/NicolMunoz012"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-accent/35 bg-surface/40 px-4 py-2 text-xs font-semibold text-accent shadow-sm backdrop-blur transition-all hover:border-accent/60 hover:bg-accent/10 active:scale-95"
              >
                {t("projects.visitGithub")}
              </a>
            </div>

            <div className="p-6">
              {status === "loading" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[140px] rounded-2xl border border-border bg-surface-2/40"
                    />
                  ))}
                </div>
              ) : status === "error" ? (
                <div className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-foreground/75">
                  {t("projects.githubError")}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {featuredRepos.map((repo) => (
                    <motion.a
                      key={repo.id}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-5 shadow-sm backdrop-blur transition-all hover:border-accent/40 hover:bg-surface-2/50"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.12),transparent_60%)]" />
                      <div className="relative flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-display text-lg font-bold text-foreground group-hover:text-accent">
                            {repo.name}
                          </span>
                          <span className="rounded-full border border-border bg-surface-2/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                            {formatRelativeDate(repo.pushedAt)}
                          </span>
                        </div>
                        <p className="line-clamp-3 text-sm leading-relaxed text-foreground/75">
                          {repo.description ?? t("projects.noDescription")}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                          {repo.language ? (
                            <span className="rounded-full border border-border bg-surface-2/60 px-3 py-1">
                              {repo.language}
                            </span>
                          ) : null}
                          <span className="rounded-full border border-border bg-surface-2/60 px-3 py-1">
                            ★ {repo.stars}
                          </span>
                          <span className="rounded-full border border-border bg-surface-2/60 px-3 py-1">
                            ⑂ {repo.forks}
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-surface/50 shadow-lg backdrop-blur">
            <div className="border-b border-border/70 px-6 py-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                {t("projects.githubActivity")}
              </span>
              <div className="mt-1 font-display text-xl font-bold text-foreground">
                {t("projects.recentCommits")}
              </div>
            </div>

            <div className="p-4">
              {status === "loading" ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[56px] rounded-2xl border border-border bg-surface-2/40"
                    />
                  ))}
                </div>
              ) : status === "error" ? (
                <div className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-foreground/75">
                  {t("projects.githubError")}
                </div>
              ) : recentCommits.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-foreground/75">
                  {t("projects.noCommits")}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentCommits.map((c) => (
                    <a
                      key={`${c.repo}-${c.sha}`}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1 rounded-2xl border border-border bg-surface/40 px-4 py-3 shadow-sm backdrop-blur transition-all hover:border-accent/40 hover:bg-surface-2/50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-xs font-bold uppercase tracking-widest text-foreground/60">
                          {c.repo}
                        </span>
                        <span className="shrink-0 text-xs text-foreground/50">
                          {formatRelativeDate(c.createdAt)}
                        </span>
                      </div>
                      <span className="line-clamp-2 text-sm text-foreground/80 group-hover:text-foreground">
                        {c.message}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Botón GitHub */}
      <Reveal direction="up" delay={0.3}>
        <div>
          <motion.a
            href="https://github.com/NicolMunoz012"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-surface/40 px-6 py-2.5 text-sm font-semibold text-accent shadow-sm backdrop-blur transition-all hover:border-accent/60 hover:bg-accent/10 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("projects.visitGithub")}
          </motion.a>
        </div>
      </Reveal>
    </section>
  );
}
