'use client';

import { useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { ExternalLink, GitFork, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "../_context/LanguageContext";
import { useTheme } from "../_context/ThemeContext";
import { Reveal } from "../_components/ui/Reveal";
import { SectionHeading } from "../_components/ui/SectionHeading";
import { useGithubOverview, type GithubRepo } from "../_hooks/useGithubOverview";
import { useMounted } from "../_hooks/useMediaQuery";
import { GITHUB_USERNAME } from "../_lib/links";

const EXPANDED_FR = 7;
const COLLAPSED_FR = 1;
const CALENDAR_MONTHS = 8;

const tag = "inline-flex items-center gap-1 rounded-full bg-primary-dark/10 px-2.5 py-1 text-xs font-semibold text-accent dark:bg-primary-dark/55";
const action =
  "pointer-events-auto inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-xs font-semibold md:min-h-9 md:text-[13px]";

/* ─────────────────────── Acordeón ─────────────────────── */

function AccordionColumn({ repos }: { repos: GithubRepo[] }) {
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = todos cerrados

  const gridRows = repos
    .map((_, i) => `${i === activeIndex ? EXPANDED_FR : COLLAPSED_FR}fr`)
    .join(" ");

  return (
    <ul
      className="project-accordion"
      data-expanded={activeIndex !== -1}
      style={{ gridTemplateRows: gridRows }}
      // Con mouse, el acordeón se cierra al salir de la columna.
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setActiveIndex(-1);
      }}
    >
      {repos.map((repo, i) => (
        <AccordionItem
          key={repo.id}
          repo={repo}
          isActive={i === activeIndex}
          onHover={() => setActiveIndex(i)}
          onToggle={() => setActiveIndex((current) => (current === i ? -1 : i))}
        />
      ))}
    </ul>
  );
}

interface AccordionItemProps {
  repo: GithubRepo;
  isActive: boolean;
  onHover: () => void;
  onToggle: () => void;
}

function AccordionItem({ repo, isActive, onHover, onToggle }: AccordionItemProps) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  // La captura se pide la primera vez que se abre el ítem y luego se conserva.
  const [everOpened, setEverOpened] = useState(false);
  if (isActive && !everOpened) setEverOpened(true);

  const name = repo.name.replace(/[-_]/g, " ");
  const panelId = `project-${repo.id}`;
  const previewUrl =
    repo.homepage && !imgError
      ? `https://api.microlink.io/?url=${encodeURIComponent(repo.homepage)}&screenshot=true&meta=false&embed=screenshot.url`
      : null;

  return (
    <li
      className="project-item"
      data-active={isActive}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onHover();
      }}
    >
      {/* El botón ocupa todo el ítem: abre y cierra con clic, toque, Enter o Espacio. */}
      <h3 className="absolute inset-0">
        <button
          type="button"
          aria-expanded={isActive}
          aria-controls={panelId}
          onClick={(e) => {
            // Con mouse el hover ya lo abrió: el clic no debe cerrarlo.
            if ((e.nativeEvent as PointerEvent).pointerType === "mouse") onHover();
            else onToggle();
          }}
          className="project-item-toggle flex h-full w-full items-center justify-center rounded-[12px] px-4"
        >
          <span
            className={`text-center text-xs font-bold uppercase leading-snug tracking-[0.18em] text-accent transition-opacity duration-200 ${
              isActive ? "opacity-0" : "opacity-100"
            }`}
          >
            {name}
          </span>
        </button>
      </h3>

      {/* Contenido: no intercepta el puntero (salvo los enlaces) para que tocar el ítem lo cierre. */}
      <div
        id={panelId}
        inert={!isActive}
        className={`pointer-events-none absolute inset-0 flex flex-col gap-2.5 overflow-y-auto p-4 transition-opacity duration-300 ${
          isActive ? "opacity-100 delay-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p aria-hidden className="text-sm font-extrabold leading-tight tracking-tight text-foreground md:text-lg">
              {name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {repo.language && <span className={tag}>{repo.language}</span>}
              <span className={tag}>
                <Star size={11} fill="currentColor" aria-hidden />
                <span className="sr-only">Stars:</span> {repo.stars}
              </span>
              <span className={tag}>
                <GitFork size={11} aria-hidden />
                <span className="sr-only">Forks:</span> {repo.forks}
              </span>
            </div>
          </div>

          {everOpened && previewUrl && (
            <div
              className={`order-first h-44 w-full shrink-0 overflow-hidden rounded-lg border border-primary-dark/35 shadow-md md:h-40 lg:order-none lg:h-[120px] lg:w-[180px] ${
                imgLoaded ? "" : "animate-pulse bg-primary-dark/15"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- captura generada por microlink en tiempo real */}
              <img
                src={previewUrl}
                alt={`${t("projects.previewAlt")} ${name}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`h-full w-full object-cover ${imgLoaded ? "" : "invisible"}`}
              />
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed text-foreground/80">
          {repo.description ?? t("projects.noDescription")}
        </p>

        <div className="flex flex-wrap gap-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${action} bg-primary text-primary-foreground transition-colors hover:bg-primary-dark`}
          >
            <FaGithub size={14} aria-hidden />
            {t("projects.repository")}
          </a>

          {repo.homepage ? (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className={`${action} bg-primary text-primary-foreground transition-colors hover:bg-primary-dark`}
            >
              <ExternalLink size={13} aria-hidden />
              {t("projects.viewDemo")}
            </a>
          ) : (
            <span className={`${action} select-none border border-primary-dark/25 text-foreground/50`}>
              <ExternalLink size={13} aria-hidden />
              {t("projects.noDemo")}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function SkeletonColumn() {
  return (
    <div className="project-accordion animate-pulse" style={{ gridTemplateRows: "1fr 1fr 1fr" }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-[14px] border border-primary-dark/20 bg-primary-dark/10" />
      ))}
    </div>
  );
}

/* ─────────────────────── Sección ─────────────────────── */

export function ProjectsSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const mounted = useMounted();
  const overview = useGithubOverview();

  const repos = overview.data?.repos ?? [];
  const columns = [repos.slice(0, 3), repos.slice(3, 6)].filter((column) => column.length > 0);

  return (
    <section
      id="projects"
      className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 md:py-16 lg:px-10"
    >
      <SectionHeading title={t("sections.projects.title")} />

      <Reveal direction="up" delay={0.15}>
        <div className="surface-card overflow-hidden rounded-3xl border border-primary-dark/15 shadow-lg">
          <div className="border-b border-primary-dark/15 px-4 py-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
              {t("projects.githubFeatured")}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {t("projects.mainProjects")}
            </p>
          </div>

          <div className="p-4 sm:p-7" aria-busy={overview.status === "loading"}>
            {overview.status === "loading" && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SkeletonColumn />
                <SkeletonColumn />
              </div>
            )}

            {overview.status === "error" && (
              <p role="alert" className="rounded-2xl border border-primary-dark/20 bg-card-2 p-6 text-sm text-foreground/80">
                {t("projects.githubError")}
              </p>
            )}

            {overview.status === "success" && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {columns.map((column) => (
                  <AccordionColumn key={column[0].id} repos={column} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-primary-dark/15 px-4 py-6 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
              {t("projects.githubActivity")}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {t("projects.recentCommits")}
            </p>

            {/* El hijo `w-max mx-auto` centra el calendario cuando cabe y deja desplazarlo completo cuando no. */}
            <div
              role="region"
              aria-label={t("projects.calendarLabel")}
              tabIndex={0}
              className="custom-scrollbar mt-5 min-h-[120px] overflow-x-auto pb-2"
            >
              <div className="mx-auto w-max">
                {mounted && (
                  <GitHubCalendar
                    username={GITHUB_USERNAME}
                    blockSize={14}
                    blockMargin={4}
                    fontSize={13}
                    colorScheme={theme}
                    theme={{
                      light: ["#ebedf0", "#ffc9e0", "#ff85c0", "#d6006b", "#8f1242"],
                      dark: ["#161b22", "#3d1f2e", "#6d0b31", "#a01550", "#e59ac4"],
                    }}
                    transformData={(data) => {
                      const since = new Date();
                      since.setMonth(since.getMonth() - CALENDAR_MONTHS);
                      return data.filter((activity) => new Date(activity.date) >= since);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
