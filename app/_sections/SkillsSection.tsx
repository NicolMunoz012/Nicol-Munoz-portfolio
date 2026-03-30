'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../_context/LanguageContext";
import { Reveal } from "../_components/ui/Reveal";
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
  const { t } = useLanguage();
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
    <section id="skills" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-16">
      <div className="relative flex flex-col gap-10">
        <Reveal direction="up">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-5 w-full max-w-4xl mx-auto">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#6D0B31]/35" />
              <h2 className="shrink-0 font-display text-[40px] font-bold tracking-tight text-[#6D0B31]">
                {t("sections.skills.title")}
              </h2>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#6D0B31]/35" />
            </div>
            <p className="max-w-2xl text-base text-foreground/70">
              {t("sections.skills.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-3xl bg-surface/30 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                    {t("skills.toyLabel")}
                  </span>
                  <span className="font-display text-xl font-bold text-foreground">
                    {t("skills.pickTech")}
                  </span>
                </div>
                <div className="rounded-full bg-[#6D0B31]/15 px-4 py-2 text-xs font-semibold text-foreground/60 shadow-sm">
                  {status === "loading"
                    ? t("skills.loading")
                    : status === "error"
                      ? t("skills.offline")
                      : t("skills.ready")}
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
                          ? "bg-surface-2/50"
                          : "bg-surface/30 hover:bg-surface-2/40"
                      }`}
                    >
                      {isSelected ? (
                        <motion.div
                          layoutId="skill-toy"
                          className="absolute -left-6 top-1/2 -translate-y-1/2 rounded-full bg-[#6D0B31]/20 px-3 py-1 text-xs font-bold text-accent shadow-sm backdrop-blur-md"
                          transition={{ type: "spring", stiffness: 450, damping: 34 }}
                        >
                          {t("skills.toy")}
                        </motion.div>
                      ) : null}

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D0B31]/15">
                        <Icon style={{ color }} size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{name}</span>
                        <span className="text-xs text-foreground/60">{t("skills.clickHint")}</span>
                      </div>

                      {isSelected && projectsForSkill.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-2xl bg-surface/80 px-4 py-3 text-left shadow-lg backdrop-blur-md lg:block"
                        >
                          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                            {t("skills.projectsFor")}
                          </div>
                          <div className="mt-2 flex flex-col gap-2">
                            {projectsForSkill.map((p) => (
                              <div key={p.name} className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">{p.name}</span>
                                <span className="max-w-[220px] text-[11px] leading-snug text-foreground/65 line-clamp-2">
                                  {p.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-surface/30 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 border-b border-[#6D0B31]/15 px-6 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
                    {t("skills.projectsFor")}
                  </span>
                  <span className="font-display text-xl font-bold text-foreground">
                    {selectedSkill?.name}
                  </span>
                </div>
                <a
                  href="https://github.com/NicolMunoz012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#6D0B31]/20 px-4 py-2 text-xs font-semibold text-accent shadow-sm backdrop-blur-sm transition-all hover:bg-[#6D0B31]/30 active:scale-95"
                >
                  {t("projects.visitGithub")}
                </a>
              </div>

              <div className="p-6">
                {projectsForSkill.length === 0 ? (
                  <div className="rounded-2xl bg-surface-2/30 p-5 text-sm text-foreground/75">
                    {t("skills.editorEmpty")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {projectsForSkill.map((p, i) => (
                      <div
                        key={`${p.name}-${i}`}
                        className="group rounded-2xl bg-surface-2/30 p-5 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-2/40"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="font-display text-base font-bold text-foreground">
                            {p.name}
                          </span>
                          {p.url ? (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-[#6D0B31]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent transition-colors hover:bg-[#6D0B31]/30"
                            >
                              {t("projects.github")}
                            </a>
                          ) : null}
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {p.description}
                        </p>
                        {p.tags && p.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {p.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[#6D0B31]/15 px-2.5 py-1 text-[11px] font-semibold text-foreground/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
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
