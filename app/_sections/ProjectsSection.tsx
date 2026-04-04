'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../_context/LanguageContext";
import { useTheme } from "../_context/ThemeContext";
import { Reveal } from "../_components/ui/Reveal";
import { GitHubCalendar } from 'react-github-calendar';

/* ─────────────────────── Types ─────────────────────── */
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

/* ─────────────────────── Accordion constants ─────── */
const ACCORDION_EASING =
  'linear(0 0%,0.1538 4.09%,0.2926 8.29%,0.4173 12.63%,0.5282 17.12%,0.6255 21.77%,0.7099 26.61%,0.782 31.67%,0.8425 37%,0.8887 42.23%,0.9257 47.79%,0.9543 53.78%,0.9752 60.32%,0.9883 67.11%,0.9961 75%,1 100%)';
const ACCORDION_DURATION = '0.55s';
const EXPANDED_FR = 5;
const COLLAPSED_FR = 1;
const COLUMN_HEIGHT = 250; // px — compact cards

/* ─────────────────────── Theme helpers ─────────────── */
// Light-mode card: soft warm gradient tinted with a repo-specific accent hue
function cardBgLight(hue: number) {
  return `linear-gradient(145deg, hsl(${hue} 28% 88% / 1) 0%, hsl(${(hue + 30) % 360} 20% 80% / 1) 100%)`;
}
// Dark-mode card: richer, more saturated gradient with better hue contrast
function cardBgDark(hue: number) {
  return `linear-gradient(145deg, hsl(${hue} 55% 18% / 1) 0%, hsl(${(hue + 50) % 360} 38% 11% / 1) 100%)`;
}

/* ─────────────────────── Icons ─────────────────────── */
function IconGithub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
function IconExternalLink() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function IconFork() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M6 9v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V9" />
      <line x1="12" y1="15" x2="12" y2="12" />
    </svg>
  );
}

/* ─────────────────────── AccordionColumn ─────────────── */
interface AccordionColumnProps {
  repos: GithubRepo[];
  activeIndex: number;          // -1 = all collapsed
  onActivate: (i: number) => void;
  onDeactivate: () => void;     // called on mouse leave
  isDark: boolean;
}

function AccordionColumn({ repos, activeIndex, onActivate, onDeactivate, isDark }: AccordionColumnProps) {
  const ulRef = useRef<HTMLUListElement>(null);

  // When all closed (-1), distribute height equally; otherwise expand the active one
  const gridRows = repos
    .map((_, i) => (i === activeIndex ? `${EXPANDED_FR}fr` : `${COLLAPSED_FR}fr`))
    .join(' ');

  // Open the item under the cursor
  function handleMouseMove(e: React.MouseEvent<HTMLUListElement>) {
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    for (const el of els) {
      const li = (el as HTMLElement).closest('li[data-idx]') as HTMLElement | null;
      if (li) {
        const idx = Number(li.dataset.idx);
        if (idx !== activeIndex) onActivate(idx);
        return;
      }
    }
  }

  // Close all when the mouse leaves the column
  function handleMouseLeave() {
    onDeactivate();
  }

  return (
    <ul
      ref={ulRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'grid',
        gridTemplateRows: gridRows,
        transition: `grid-template-rows ${ACCORDION_DURATION} ${ACCORDION_EASING}`,
        height: `${COLUMN_HEIGHT}px`,
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '6px',
      }}
    >
      {repos.map((repo, i) => (
        <AccordionItem
          key={repo.id}
          repo={repo}
          index={i}
          isActive={i === activeIndex}
          onActivate={onActivate}
          isDark={isDark}
        />
      ))}
    </ul>
  );
}

/* ─────────────────────── AccordionItem ───────────────── */
interface AccordionItemProps {
  repo: GithubRepo;
  index: number;
  isActive: boolean;
  onActivate: (i: number) => void;
  isDark: boolean;
}

function AccordionItem({ repo, index, isActive, onActivate, isDark }: AccordionItemProps) {
  const hue = (repo.id * 37 + 300) % 360;
  const bgGradient = isDark ? cardBgDark(hue) : cardBgLight(hue);
  const hasHomepage = !!repo.homepage;

  // Theme-dependent text/overlay colors
  const overlayActive = isDark
    ? 'linear-gradient(180deg, rgba(6,1,12,0.50) 0%, rgba(12,3,22,0.80) 100%)'
    : 'linear-gradient(180deg, rgba(109,11,49,0.08) 0%, rgba(109,11,49,0.22) 100%)';
  const overlayCollapsed = isDark
    ? 'linear-gradient(180deg, rgba(6,1,12,0.62) 0%, rgba(12,3,22,0.88) 100%)'
    : 'linear-gradient(180deg, rgba(109,11,49,0.14) 0%, rgba(109,11,49,0.30) 100%)';

  const titleColor = isDark ? '#ffffff' : '#3d0a1c';
  const collapsedNameColor = isDark ? 'rgba(244,192,209,0.90)' : 'rgba(109,11,49,0.75)';
  const descColor = isDark ? 'rgba(249,246,238,0.78)' : 'rgba(43,22,58,0.72)';

  // Tag/pill styles (same palette, just opacity-adapted)
  const tagStyle = {
    background: isDark ? 'rgba(109,11,49,0.55)' : 'rgba(109,11,49,0.12)',
    color: isDark ? '#f4c0d1' : '#6D0B31',
  };

  return (
    <li
      data-idx={index}
      onClick={() => onActivate(index)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        border: isActive
          ? '2px solid rgba(143,18,66,0.70)'
          : '2px solid rgba(109,11,49,0.40)',
        cursor: 'pointer',
        transition: `border-color 0.3s ease`,
        background: bgGradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isActive ? overlayActive : overlayCollapsed,
          transition: `background ${ACCORDION_DURATION} ease`,
          zIndex: 1,
        }}
      />

      {/* ─── Collapsed: centered name ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          opacity: isActive ? 0 : 1,
          transition: `opacity 0.22s ease`,
          pointerEvents: isActive ? 'none' : 'auto',
          padding: '0 14px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: collapsedNameColor,
            textAlign: 'center',
            lineHeight: 1.35,
          }}
        >
          {repo.name.replace(/-/g, ' ')}
        </span>
      </div>

      {/* ─── Expanded: full content ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2,
          opacity: isActive ? 1 : 0,
          transition: `opacity 0.28s ease ${isActive ? '0.12s' : '0s'}`,
          pointerEvents: isActive ? 'auto' : 'none',
          padding: '20px 20px 18px',
        }}
      >
        {/* Top: repo name */}
        <div
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(-10px)',
            transition: `opacity 0.30s ease ${isActive ? '0.16s' : '0s'}, transform 0.30s ease ${isActive ? '0.16s' : '0s'}`,
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: '18px',
              color: titleColor,
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1.2,
            }}
          >
            {repo.name.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Bottom: tags + description + buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.30s ease ${isActive ? '0.20s' : '0s'}, transform 0.30s ease ${isActive ? '0.20s' : '0s'}`,
          }}
        >
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {repo.language && (
              <span
                style={{
                  ...tagStyle,
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '99px',
                  letterSpacing: '0.04em',
                }}
              >
                {repo.language}
              </span>
            )}
            <span
              style={{
                ...tagStyle,
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '99px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <IconStar /> {repo.stars}
            </span>
            <span
              style={{
                ...tagStyle,
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '99px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <IconFork /> {repo.forks}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: 1.55,
              color: descColor,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {repo.description ?? 'Sin descripción.'}
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '7px',
              flexWrap: 'wrap',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.28s ease ${isActive ? '0.26s' : '0s'}, transform 0.28s ease ${isActive ? '0.26s' : '0s'}`,
            }}
          >
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '99px',
                border: '1.5px solid rgba(109,11,49,0.60)',
                background: 'rgba(109,11,49,0.45)',
                color: '#f4c0d1',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s, border-color 0.2s',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(109,11,49,0.72)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(143,18,66,0.85)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(109,11,49,0.45)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(109,11,49,0.60)';
              }}
            >
              <IconGithub />
              Repositorio
            </a>

            {hasHomepage ? (
              <a
                href={repo.homepage!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '99px',
                  border: '1.5px solid #8F1242',
                  background: '#8F1242',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#6D0B31'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#8F1242'; }}
              >
                <IconExternalLink />
                Ver demo
              </a>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '99px',
                  border: '1.5px solid rgba(109,11,49,0.22)',
                  color: isDark ? 'rgba(244,192,209,0.35)' : 'rgba(109,11,49,0.35)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'not-allowed',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconExternalLink />
                Sin demo
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/* ─────────────────────── Skeleton loader ─────────────── */
function SkeletonColumn({ isDark }: { isDark: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: `${COLUMN_HEIGHT}px` }}>
      {[10, 1, 1].map((fr, i) => (
        <div
          key={i}
          style={{
            flex: fr,
            borderRadius: '14px',
            border: '2px solid rgba(109,11,49,0.22)',
            background: isDark ? 'rgba(109,11,49,0.10)' : 'rgba(109,11,49,0.06)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────── Main section ───────────────── */
export function ProjectsSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [data, setData] = useState<GithubOverview | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeIndexA, setActiveIndexA] = useState(-1);
  const [activeIndexB, setActiveIndexB] = useState(-1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      try {
        const res = await fetch('/api/github/overview');
        if (!res.ok) throw new Error('github_overview_failed');
        const json = (await res.json()) as GithubOverview;
        if (!cancelled) { setData(json); setStatus('success'); }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const allRepos = useMemo(() => data?.repos ?? [], [data]);
  const colA = useMemo(() => allRepos.slice(0, 3), [allRepos]);
  const colB = useMemo(() => allRepos.slice(3, 6), [allRepos]);

  return (
    <section
      id="projects"
      className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-10 py-16"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Section heading */}
      <Reveal direction="up">
        <div className="flex items-center gap-5 w-full max-w-5xl mx-auto">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
          <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
            {t('sections.projects.title')}
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
        </div>
      </Reveal>

      {/* Main panel */}
      <Reveal direction="up" delay={0.15}>
        <div className="overflow-hidden rounded-3xl border-1 border-[#6D0B31]/15 bg-surface/50 shadow-lg backdrop-blur-sm">

          {/* Panel header */}
          <div className="border-b-1 border-[#6D0B31]/15 px-8 py-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
              {t('projects.githubFeatured')}
            </span>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">
              {t('projects.mainProjects')}
            </div>
          </div>

          {/* Accordion grid */}
          <div className="p-7">
            {status === 'loading' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SkeletonColumn isDark={isDark} />
                <SkeletonColumn isDark={isDark} />
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-2xl border-1 border-[#6D0B31]/15 bg-surface/50 p-6 text-sm text-foreground/75">
                {t('projects.githubError')}
              </div>
            )}

            {status === 'success' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {colA.length >= 3 && (
                  <AccordionColumn
                    repos={colA}
                    activeIndex={activeIndexA}
                    onActivate={setActiveIndexA}
                    onDeactivate={() => setActiveIndexA(-1)}
                    isDark={isDark}
                  />
                )}
                {colB.length >= 3 && (
                  <AccordionColumn
                    repos={colB}
                    activeIndex={activeIndexB}
                    onActivate={setActiveIndexB}
                    onDeactivate={() => setActiveIndexB(-1)}
                    isDark={isDark}
                  />
                )}
                {/* Fallback: fewer than 6 repos */}
                {colB.length < 3 && colA.length >= 1 && (
                  <AccordionColumn
                    repos={colA.slice(0, Math.min(colA.length, 3))}
                    activeIndex={activeIndexA}
                    onActivate={setActiveIndexA}
                    onDeactivate={() => setActiveIndexA(-1)}
                    isDark={isDark}
                  />
                )}
              </div>
            )}
          </div>

          {/* GitHub Calendar */}
          <div className="border-t-1 border-[#6D0B31]/15 px-8 py-6">
            {/* Calendar header */}
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                {t('projects.githubActivity')}
              </span>
              <div className="mt-1 font-display text-2xl font-bold text-foreground">
                {t('projects.recentCommits')}
              </div>
            </div>

            <div className="flex items-center justify-center overflow-x-auto min-h-[120px]">
              {mounted && (
                <GitHubCalendar
                  username="NicolMunoz012"
                  blockSize={14}
                  blockMargin={4}
                  fontSize={13}
                  colorScheme={isDark ? 'dark' : 'light'}
                  theme={{
                    light: ['#ebedf0', '#ffc9e0', '#ff85c0', '#d6006b', '#8f1242'],
                    dark: ['#161b22', '#3d1f2e', '#6d0b31', '#a01550', '#e59ac4'],
                  }}
                  transformData={(data) => {
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 8);
                    return data.filter((activity) => new Date(activity.date) >= sixMonthsAgo);
                  }}
                />
              )}
            </div>
          </div>

        </div>
      </Reveal>
    </section>
  );
}