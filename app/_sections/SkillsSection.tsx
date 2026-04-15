'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";
import { enTranslations } from "../_i18n/locales/en";
import { esTranslations } from "../_i18n/locales/es";
import {
  SiPython,
  SiSpringboot,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";

type Skill = {
  name: string;
  Icon: IconType;
  color: string;
  match: {
    languages?: string[];
    keywords?: string[];
  };
};

const SKILLS: Skill[] = [
  { name: "Java",        Icon: FaJava,        color: "#ed8b00", match: { languages: ["Java"] } },
  { name: "Python",      Icon: SiPython,      color: "#3776ab", match: { languages: ["Python"] } },
  { name: "Spring",      Icon: SiSpringboot,  color: "#6db33f", match: { languages: ["Java"], keywords: ["spring"] } },
  { name: "Tailwind",    Icon: SiTailwindcss, color: "#06b6d4", match: { languages: ["CSS", "TypeScript", "JavaScript"], keywords: ["tailwind"] } },
  { name: "Next.js",     Icon: SiNextdotjs,   color: "currentColor", match: { languages: ["TypeScript", "JavaScript"], keywords: ["next"] } },
  { name: "React",       Icon: SiReact,       color: "#61dafb", match: { languages: ["TypeScript", "JavaScript"], keywords: ["react"] } },
];

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
};

type GithubOverview = {
  allRepos?: GithubRepo[];
  repos: GithubRepo[];
};

type SkillProject = {
  name: string;
  description: string;
  url?: string;
  tags?: string[];
};

const FALLBACK_PROJECTS: Record<string, SkillProject[]> = {
  Java: [
    {
      name: "Campus Scheduler",
      description: "A course planner with conflict detection and a clean, responsive UI.",
      tags: ["OOP", "Collections", "Testing"],
    },
    {
      name: "Inventory Console",
      description: "CLI inventory manager with validation, exports, and simple analytics.",
      tags: ["CLI", "Data Structures"],
    },
  ],
  Python: [
    {
      name: "Study Buddy Bot",
      description: "A small automation tool that organizes notes and daily tasks.",
      tags: ["Automation", "Scripting"],
    },
    {
      name: "Data Notebook",
      description: "Exploratory analysis templates for quick insights and visualization.",
      tags: ["Data", "Visualization"],
    },
  ],
  Spring: [
    {
      name: "API Starter",
      description: "REST API starter with auth-ready structure and clean architecture.",
      tags: ["REST", "Spring Boot"],
    },
  ],
  "Next.js": [
    {
      name: "Portfolio vNext",
      description: "A cinematic portfolio with multilingual support and smooth transitions.",
      tags: ["App Router", "UI"],
    },
  ],
  React: [
    {
      name: "UI Playground",
      description: "Component experiments focused on micro-interactions and motion.",
      tags: ["Components", "Motion"],
    },
  ],
  Tailwind: [
    {
      name: "Design System",
      description: "Token-based styling + reusable patterns for fast iteration.",
      tags: ["Tokens", "UI"],
    },
  ],
};

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Math.max(0, Date.now() - d.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export function SkillsSection() {
  const { t, locale } = useLanguage();
  const [selected, setSelected] = useState(SKILLS[0]?.name ?? "Java");
  const [overview, setOverview] = useState<GithubOverview | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const res = await fetch("/api/github/overview");
        if (!res.ok) throw new Error("github_overview_failed");
        const json = (await res.json()) as GithubOverview;
        if (!cancelled) {
          setOverview(json);
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

  const selectedSkill = useMemo(
    () => SKILLS.find((s) => s.name === selected) ?? SKILLS[0],
    [selected],
  );

  const repoPool = useMemo(() => {
    const all = overview?.allRepos;
    if (all && all.length > 0) return all;
    return overview?.repos ?? [];
  }, [overview]);

  const projectsForSkill = useMemo(() => {
    const skill = selectedSkill;
    if (!skill) return [];

    const langs = skill.match.languages?.map((x) => x.toLowerCase()) ?? [];
    const keywords = skill.match.keywords?.map((x) => x.toLowerCase()) ?? [];

    const fromGithub = repoPool
      .filter((r) => {
        const lang = (r.language ?? "").toLowerCase();
        const hay = `${r.name} ${r.fullName} ${r.description ?? ""}`.toLowerCase();
        const langOk = langs.length === 0 ? false : langs.includes(lang);
        const keywordOk =
          keywords.length === 0 ? false : keywords.some((k) => hay.includes(k));
        if (skill.name === "React" || skill.name === "Next.js" || skill.name === "Tailwind") {
          return keywordOk || langs.includes(lang);
        }
        return langOk || keywordOk;
      })
      .slice(0, 2)
      .map<SkillProject>((r) => ({
        name: r.name,
        description: r.description ?? t("projects.noDescription"),
        url: r.url,
        tags: [
          ...(r.language ? [r.language] : []),
          `★ ${r.stars}`,
          `${formatRelative(r.pushedAt)} ${t("skills.editorUpdated")}`,
        ],
      }));

    if (fromGithub.length > 0) return fromGithub;
    return (FALLBACK_PROJECTS[skill.name] ?? []).slice(0, 2);
  }, [repoPool, selectedSkill, t]);

  return (
    <section id="skills" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-10">
      <div className="relative flex flex-col gap-10">
        <Reveal direction="up">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
              <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
              <h2 className="shrink-0 font-display text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-tight text-[#6D0B31] dark:text-[#b31955]">
                {t("sections.skills.title")}
              </h2>
              <div className="flex-1 h-[1px] dark:h-[3px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
            </div>
            <p className="max-w-2xl text-lg text-foreground/70">
              {t("sections.skills.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <div className="relative overflow-hidden rounded-3xl bg-surface/90 dark:bg-[#302149]/70 p-4 shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-display text-xl font-bold text-foreground">
                    {t("skills.pickTech")}
                  </span>
                </div>
              </div>

              <div className="relative mt-5 flex flex-col gap-2">
                {SKILLS.map(({ name, Icon, color }) => {
                  const isSelected = selected === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setSelected(name);
                      }}
                      className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-left shadow-sm backdrop-blur-sm transition-all ${
                        isSelected
                          ? "bg-[#6D0B31] dark:bg-[#8F1242]"
                          : "bg-surface/90 dark:bg-[#302149]/70 hover:bg-surface-2/95 dark:bg-[#302149]/65"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isSelected ? "bg-white/20" : "bg-[#6D0B31]/15"
                      }`}>
                        <Icon style={{ color: isSelected ? "#ffffff" : color }} size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-base font-bold ${
                          isSelected ? "text-white" : "text-foreground"
                        }`}>{name}</span>
                        <span className={`text-sm ${
                          isSelected ? "text-white/70" : "text-foreground/60"
                        }`}>{t("skills.clickHint")}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-surface/90 dark:bg-[#302149]/70 shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,154,196,0.16),transparent_60%)]" />
              <div className="relative flex items-center justify-between gap-4 border-b border-[#6D0B31]/15 px-6 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                    {t("skills.projectsFor")}
                  </span>
                  <span className="font-display text-xl font-bold text-foreground">
                    {selectedSkill?.name}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Descripción del uso de la tecnología */}
                {(() => {
                  const translations = locale === "es" ? esTranslations : enTranslations;
                  const desc = translations.skills.skillDescriptions[selectedSkill?.name as keyof typeof translations.skills.skillDescriptions];
                  return desc ? (
                    <div className="mb-6 rounded-2xl bg-[#6D0B31]/8 px-5 py-4">
                      <p className="text-base leading-relaxed text-foreground/80">{desc}</p>
                    </div>
                  ) : null;
                })()}

                {/* Subtítulo de repos */}
                {projectsForSkill.length > 0 && (
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50">
                    {t("skills.reposSubtitle")}
                  </p>
                )}

                {projectsForSkill.length === 0 ? (
                  <div className="rounded-2xl bg-surface-2/90 dark:bg-[#302149]/60 p-5 text-base text-foreground/75">
                    {t("skills.editorEmpty")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {projectsForSkill.map((p, i) => (
                      <div
                        key={`${p.name}-${i}`}
                        className="group flex flex-col rounded-2xl bg-surface-2/90 dark:bg-[#302149]/60 p-5 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-2/95 dark:bg-[#302149]/65"
                      >
                        <div className="mb-3 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-display text-base font-bold text-foreground line-clamp-1">
                              {p.name}
                            </span>
                            {p.url && (
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 rounded-full bg-[#6D0B31]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent transition-colors hover:bg-[#6D0B31]/30"
                              >
                                {t("projects.github")}
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="mb-3 text-base leading-relaxed text-foreground/80 flex-grow">
                          {p.description}
                        </p>
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {p.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[#6D0B31]/15 px-2.5 py-1 text-[11px] font-semibold text-foreground/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}









