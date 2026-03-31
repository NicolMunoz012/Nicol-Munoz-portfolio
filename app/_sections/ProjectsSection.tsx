'use client';

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { useTheme } from "../_context/ThemeContext";
import { Reveal } from "../_components/ui/Reveal";
import { GitHubCalendar } from 'react-github-calendar';

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
  homepage: string | null;
};

type GithubOverview = {
  username: string;
  repos: GithubRepo[];
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

function IconGithub() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

function RepoRow({
  repo,
  isOpen,
  onClick,
}: {
  repo: GithubRepo;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 bg-surface/50
        ${isOpen
          ? "border-[#8F1242]/70 bg-[#ffc9e0]/25 dark:bg-[#6D0B31]/30 shadow-md"
          : "border-[#6D0B31]/40 hover:border-[#6D0B31]/60 hover:bg-surface-2/60"
        }`}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="font-display text-sm font-bold text-foreground truncate">
          {repo.name}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {repo.language && (
            <span className="rounded-full bg-[#6D0B31]/15 px-2.5 py-0.5 text-[11px] text-foreground/60">
              {repo.language}
            </span>
          )}
          <span className="rounded-full bg-[#6D0B31]/15 px-2.5 py-0.5 text-[11px] text-foreground/60">
            ★ {repo.stars}
          </span>
          <span className="rounded-full bg-[#6D0B31]/15 px-2.5 py-0.5 text-[11px] text-foreground/60">
            ⑂ {repo.forks}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-[#6D0B31]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
          {formatRelativeDate(repo.pushedAt)}
        </span>
        <span className="text-foreground/40">
          <IconChevron open={isOpen} />
        </span>
      </div>
    </button>
  );
}

function DescriptionPanel({ repo }: { repo: GithubRepo | null }) {
  const { t } = useLanguage();

  return (
    <div className="flex h-full flex-col justify-center px-6 py-5">
      <AnimatePresence mode="wait">
        {repo ? (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50">
                {repo.language ?? "—"}
              </span>
              <span className="font-display text-xl font-bold text-foreground">
                {repo.name}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-foreground/70">
              {repo.description ?? t("projects.noDescription")}
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border-2 border-[#6D0B31]/50 bg-[#6D0B31]/10 px-4 py-1.5 text-xs font-semibold text-[#6D0B31] transition-all hover:bg-[#6D0B31]/20 hover:border-[#6D0B31]/70 dark:text-[#e59ac4] dark:border-[#e59ac4]/40 dark:bg-[#e59ac4]/10 dark:hover:bg-[#e59ac4]/20"
              >
                <IconGithub />
                Repositorio
              </a>

              {repo.homepage ? (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border-2 border-[#8F1242]/60 bg-[#8F1242] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#6D0B31] hover:border-[#6D0B31]"
                >
                  <IconExternalLink />
                  Ver demo
                </a>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full border-2 border-[#6D0B31]/20 px-4 py-1.5 text-xs text-foreground/35 cursor-not-allowed select-none">
                  <IconExternalLink />
                  Sin demo
                </span>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-center text-sm text-foreground/40"
          >
            Selecciona un proyecto para ver su descripción
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProjectsSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [data, setData] = useState<GithubOverview | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const res = await fetch("/api/github/overview");
        if (!res.ok) throw new Error("github_overview_failed");
        const json = (await res.json()) as GithubOverview;
        if (!cancelled) { setData(json); setStatus("success"); }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const featuredRepos = useMemo(() => data?.repos ?? [], [data]);

  function handleRepoClick(repo: GithubRepo) {
    setSelectedRepo((prev) => (prev?.id === repo.id ? null : repo));
  }

  return (
    <section
      id="projects"
      className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-10 py-16"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <Reveal direction="up">
        <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
          <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
            {t("sections.projects.title")}
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
        </div>
      </Reveal>

      <Reveal direction="up" delay={0.15}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">

          {/* ── Columna izquierda: lista de repos ── */}
          <div className="overflow-hidden rounded-3xl border-2 border-[#6D0B31]/40 bg-surface/50 shadow-lg backdrop-blur-sm">
            <div className="border-b-2 border-[#6D0B31]/35 px-6 py-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                {t("projects.githubFeatured")}
              </span>
              <div className="mt-1 font-display text-xl font-bold text-foreground">
                {t("projects.mainProjects")}
              </div>
            </div>

            <div className="flex flex-col gap-3 p-5">
              {status === "loading" &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[72px] animate-pulse rounded-2xl border-2 border-[#6D0B31]/25 bg-surface-2/50"
                  />
                ))
              }
              {status === "error" && (
                <div className="rounded-2xl border-2 border-[#6D0B31]/35 bg-surface/50 p-6 text-sm text-foreground/75">
                  {t("projects.githubError")}
                </div>
              )}
              {status === "success" && featuredRepos.map((repo) => (
                <RepoRow
                  key={repo.id}
                  repo={repo}
                  isOpen={selectedRepo?.id === repo.id}
                  onClick={() => handleRepoClick(repo)}
                />
              ))}
            </div>
          </div>

          {/* ── Columna derecha: mitad descripción + mitad calendario ── */}
          <div className="flex flex-col overflow-hidden rounded-3xl border-2 border-[#6D0B31]/40 bg-surface/50 shadow-lg backdrop-blur-sm">

            {/* Mitad superior — descripción del proyecto seleccionado */}
            <div className="flex flex-1 border-b-2 border-[#6D0B31]/25">
              <DescriptionPanel repo={selectedRepo} />
            </div>

            {/* Mitad inferior — calendario de GitHub */}
            <div className="flex flex-1 flex-col px-6 py-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                {t("projects.githubActivity")}
              </span>
              <div className="mt-1 mb-4 font-display text-xl font-bold text-foreground">
                {t("projects.recentCommits")}
              </div>
              <div className="flex flex-1 items-center justify-center overflow-x-auto">
                <GitHubCalendar
                  username="NicolMunoz012"
                  blockSize={12}
                  blockMargin={4}
                  fontSize={14}
                  colorScheme={theme === "dark" ? "dark" : "light"}
                  theme={{
                    light: ['#ebedf0', '#ffc9e0', '#ff85c0', '#d6006b', '#8f1242'],
                    dark: ['#161b22', '#3d1f2e', '#6d0b31', '#a01550', '#e59ac4'],
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </Reveal>
    </section>
  );
}