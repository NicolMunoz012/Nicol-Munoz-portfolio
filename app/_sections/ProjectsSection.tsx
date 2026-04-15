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
const EXPANDED_FR = 7;
const COLLAPSED_FR = 1;

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getColumnHeight(breakpoint: Breakpoint, isExpanded: boolean): number {
  if (breakpoint === 'mobile') {
    // Solo en mobile: altura dinámica
    return isExpanded ? 540 : 280;
  }
  // Tablet y desktop: altura fija
  if (breakpoint === 'tablet') return 500;
  return 380;
}

/* ─────────────────────── Theme helpers ─────────────── */
// Light-mode card: color del fondo con movimiento #f9f6ee
function cardBgLight() {
  return 'linear-gradient(135deg, #fdf8f0 0%, #f9f0f3 100%)';
}
// Dark-mode card: completamente transparente
function cardBgDark() {
  return 'transparent';
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
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());
  const isExpanded = activeIndex !== -1;
  const columnHeight = getColumnHeight(breakpoint, isExpanded);

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        transition: `grid-template-rows ${ACCORDION_DURATION} ${ACCORDION_EASING}, height ${ACCORDION_DURATION} ${ACCORDION_EASING}`,
        height: `${columnHeight}px`,
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
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());
  
  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const bgGradient = isDark ? cardBgDark() : cardBgLight();
  const hasHomepage = !!repo.homepage;
  const previewUrl = hasHomepage && !imgError
    ? `https://api.microlink.io/?url=${encodeURIComponent(repo.homepage!)}&screenshot=true&meta=false&embed=screenshot.url`
    : null;

  // Responsive styles
  const isDesktop = breakpoint === 'desktop';
  const isTablet = breakpoint === 'tablet';
  const isMobile = breakpoint === 'mobile';
  
  const imgWidth = isDesktop ? '210px' : '100%';
  const imgHeight = isMobile ? '180px' : isTablet ? '160px' : '135px';
  const titleFontSize = isMobile ? '14px' : '18px';
  const buttonFontSize = isMobile ? '11px' : '13px';
  const buttonPadding = isMobile ? '5px 10px' : '6px 14px';

  // Theme-dependent text/overlay colors
const overlayActive = isDark
  ? 'linear-gradient(180deg, rgba(6,1,12,0.50) 0%, rgba(12,3,22,0.80) 100%)'
  : 'none';
const overlayCollapsed = isDark
  ? 'linear-gradient(180deg, rgba(6,1,12,0.62) 0%, rgba(12,3,22,0.88) 100%)'
  : 'none';

  const titleColor = isDark ? '#ffffff' : '#3d0a1c';
  const collapsedNameColor = isDark ? 'rgba(244,192,209,0.90)' : 'rgba(109,11,49,0.75)';
  const descColor = isDark ? 'rgba(249,246,238,0.78)' : 'rgba(43,22,58,0.72)';

  // Tag/pill styles (same palette, just opacity-adapted)
  const tagStyle = {
    background: isDark ? 'rgba(109,11,49,0.55)' : 'rgba(109,11,49,0.07)',
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
          ? '2px solid #6d0b31'
          : '1px solid rgba(109, 11, 49, 0.22)',
        cursor: 'pointer',
        transition: `border-color 0.3s ease, background-color 0.3s ease, background-image 0.3s ease`,
        backgroundColor: 'transparent',
        backgroundImage: isActive
          ? (isDark ? 'none' : 'linear-gradient(135deg, #fdf4f7 0%, #f5e8ed 100%)')
          : (isDark ? 'none' : bgGradient),
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
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          zIndex: 2,
          opacity: isActive ? 1 : 0,
          transition: `opacity 0.28s ease ${isActive ? '0.12s' : '0s'}`,
          pointerEvents: isActive ? 'auto' : 'none',
          padding: '14px 16px',
          gap: '10px',
          overflowY: 'auto',
        }}
      >
        {/* Tablet/Mobile preview image at top */}
        {isActive && previewUrl && !isDesktop && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: imgHeight,
              borderRadius: '8px',
              border: '1.5px solid rgba(109,11,49,0.35)',
              overflow: 'hidden',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease 0.18s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {!imgLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(109,11,49,0.12)',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            )}
            <img
              src={previewUrl}
              alt={`Preview of ${repo.name}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imgError ? 'none' : 'block',
              }}
            />
          </div>
        )}

        {/* Desktop: Top row - Title + Tags + Image */}
        {isDesktop ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '14px',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(-10px)',
              transition: `opacity 0.30s ease ${isActive ? '0.16s' : '0s'}, transform 0.30s ease ${isActive ? '0.16s' : '0s'}`,
            }}
          >
            {/* Left: Title + Tags */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {/* Repo name */}
              <span
                style={{
                  fontWeight: 800,
                  fontSize: titleFontSize,
                  color: titleColor,
                  letterSpacing: '-0.02em',
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                {repo.name.replace(/-/g, ' ')}
              </span>

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
            </div>

            {/* Right: Preview image */}
            {isActive && previewUrl && (
              <div
                style={{
                  flexShrink: 0,
                  width: '180px',
                  height: '120px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(109,11,49,0.35)',
                  overflow: 'hidden',
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease 0.18s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {!imgLoaded && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(109,11,49,0.12)',
                      animation: 'shimmer 1.5s infinite',
                    }}
                  />
                )}
                <img
                  src={previewUrl}
                  alt={`Preview of ${repo.name}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: imgError ? 'none' : 'block',
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          /* Mobile/Tablet: Just Title + Tags */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(-10px)',
              transition: `opacity 0.30s ease ${isActive ? '0.16s' : '0s'}, transform 0.30s ease ${isActive ? '0.16s' : '0s'}`,
            }}
          >
            {/* Repo name */}
            <span
              style={{
                fontWeight: 800,
                fontSize: titleFontSize,
                color: titleColor,
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.2,
              }}
            >
              {repo.name.replace(/-/g, ' ')}
            </span>

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
          </div>
        )}

        {/* Bottom row: Description + Buttons (full width) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.30s ease ${isActive ? '0.20s' : '0s'}, transform 0.30s ease ${isActive ? '0.20s' : '0s'}`,
          }}
        >
          {/* Description */}
          <p
            style={{
              margin: 0,
              fontSize: '14.5px',
              lineHeight: 1.55,
              color: descColor,
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
                padding: buttonPadding,
                borderRadius: '99px',
                border: '1.5px solid #8F1242',
                background: '#8F1242',
                color: '#fff',
                fontSize: buttonFontSize,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#6D0B31'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#8F1242'; }}
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
                  padding: buttonPadding,
                  borderRadius: '99px',
                  border: '1.5px solid #8F1242',
                  background: '#8F1242',
                  color: '#fff',
                  fontSize: buttonFontSize,
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
                  padding: buttonPadding,
                  borderRadius: '99px',
                  border: '1.5px solid rgba(109,11,49,0.22)',
                  color: isDark ? 'rgba(244,192,209,0.35)' : 'rgba(109,11,49,0.35)',
                  fontSize: buttonFontSize,
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
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());
  const columnHeight = getColumnHeight(breakpoint, false);

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: `${columnHeight}px` }}>
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
          <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
          <h2 className="shrink-0 font-display text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
            {t('sections.projects.title')}
          </h2>
          <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
        </div>
      </Reveal>

      {/* Main panel */}
      <Reveal direction="up" delay={0.15}>
        <div className="relative overflow-hidden rounded-3xl border-1 border-[#6D0B31]/15 bg-surface/90 dark:bg-[#302149]/70 shadow-lg backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />

          {/* Panel header */}
          <div className="relative border-b-1 border-[#6D0B31]/15 px-8 py-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
              {t('projects.githubFeatured')}
            </span>
            <div className="mt-1 font-display text-2xl font-bold text-foreground">
              {t('projects.mainProjects')}
            </div>
          </div>

          {/* Accordion grid */}
          <div className="relative p-7">
            {status === 'loading' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SkeletonColumn isDark={isDark} />
                <SkeletonColumn isDark={isDark} />
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-2xl border-1 border-[#6D0B31]/15 bg-surface/90 dark:bg-[#302149]/70 p-6 text-sm text-foreground/75">
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
          <div className="relative border-t-1 border-[#6D0B31]/15 px-8 py-6">
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








