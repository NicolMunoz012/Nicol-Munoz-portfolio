'use client';

import { useMemo, useState } from "react";
import {
  SiPython,
  SiSpringboot,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { FaJava, FaBrain } from "react-icons/fa";
import type { IconType } from "react-icons";
import { useLanguage } from "../_context/LanguageContext";
import { translations } from "../_i18n";
import { Reveal } from "../_components/ui/Reveal";
import { SectionHeading } from "../_components/ui/SectionHeading";
import { useGithubOverview } from "../_hooks/useGithubOverview";
import { handleTabListKeyDown } from "../_lib/a11y";

type SkillName = "IA" | "Java" | "Python" | "Spring" | "Tailwind" | "Next.js" | "React";

type Skill = {
  name: SkillName;
  Icon: IconType;
  color: string;
  /** Un repo cuenta para la skill si coincide su lenguaje o alguna palabra clave. */
  languages: string[];
  keywords: string[];
};

const SKILLS: Skill[] = [
  { name: "IA", Icon: FaBrain, color: "#ff6b6b", languages: ["python"], keywords: ["ai", "ml", "machine", "learning", "neural", "tensorflow", "keras"] },
  { name: "Java", Icon: FaJava, color: "#ed8b00", languages: ["java"], keywords: [] },
  { name: "Python", Icon: SiPython, color: "#3776ab", languages: ["python"], keywords: [] },
  { name: "Spring", Icon: SiSpringboot, color: "#6db33f", languages: ["java"], keywords: ["spring"] },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#06b6d4", languages: ["css", "typescript", "javascript"], keywords: ["tailwind"] },
  { name: "Next.js", Icon: SiNextdotjs, color: "currentColor", languages: ["typescript", "javascript"], keywords: ["next"] },
  { name: "React", Icon: SiReact, color: "#61dafb", languages: ["typescript", "javascript"], keywords: ["react"] },
];

function formatRelative(iso: string, now: number) {
  const hours = Math.floor(Math.max(0, now - new Date(iso).getTime()) / 3600000);
  return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
}

export function SkillsSection() {
  const { t, locale } = useLanguage();
  const [selected, setSelected] = useState<SkillName>(SKILLS[0].name);
  const overview = useGithubOverview();
  // Referencia de tiempo fija por montaje para las fechas relativas.
  const [now] = useState(() => Date.now());

  const skill = SKILLS.find((s) => s.name === selected) ?? SKILLS[0];

  const projects = useMemo(() => {
    const pool = overview.data?.allRepos?.length ? overview.data.allRepos : overview.data?.repos ?? [];
    return pool
      .filter((repo) => {
        const haystack = `${repo.name} ${repo.fullName} ${repo.description ?? ""}`.toLowerCase();
        return (
          skill.languages.includes((repo.language ?? "").toLowerCase()) ||
          skill.keywords.some((keyword) => haystack.includes(keyword))
        );
      })
      .slice(0, 2);
  }, [overview.data, skill]);

  return (
    <section id="skills" className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
      <div className="flex flex-col gap-10">
        <SectionHeading
          title={t("sections.skills.title")}
          subtitle={t("sections.skills.subtitle")}
        />

        <Reveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <div className="surface-card rounded-3xl p-4 shadow-lg">
              <h3 id="skills-list-title" className="font-display text-xl font-bold text-foreground">
                {t("skills.pickTech")}
              </h3>

              <div
                role="tablist"
                aria-orientation="vertical"
                aria-labelledby="skills-list-title"
                onKeyDown={handleTabListKeyDown}
                className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
              >
                {SKILLS.map(({ name, Icon, color }) => {
                  const isSelected = selected === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      id={`skill-tab-${name}`}
                      aria-selected={isSelected}
                      aria-controls="skills-panel"
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setSelected(name)}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left shadow-sm transition-colors sm:px-4 ${
                        isSelected
                          ? "bg-linear-to-r from-primary to-primary-dark text-primary-foreground"
                          : "bg-card-2/70 text-foreground hover:bg-card-2"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isSelected ? "bg-white/20" : "bg-primary-dark/15"
                        }`}
                      >
                        <Icon style={{ color: isSelected ? "#ffffff" : color }} size={20} aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-base font-bold">{name}</span>
                        <span className={`text-sm ${isSelected ? "text-white/80" : "text-foreground/70"}`}>
                          {t("skills.clickHint")}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              id="skills-panel"
              role="tabpanel"
              aria-labelledby={`skill-tab-${skill.name}`}
              className="surface-card overflow-hidden rounded-3xl shadow-lg"
            >
              <div className="border-b border-primary-dark/15 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
                  {t("skills.projectsFor")}
                </p>
                <p className="font-display text-xl font-bold text-foreground">{skill.name}</p>
              </div>

              <div className="p-6">
                <p className="mb-6 rounded-2xl bg-primary-dark/10 px-5 py-4 text-pretty text-base leading-relaxed text-foreground/85">
                  {/* Acceso directo: la clave "Next.js" contiene un punto y no sirve como ruta de t(). */}
                  {translations[locale].skills.skillDescriptions[skill.name]}
                </p>

                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
                  {t("skills.reposSubtitle")}
                </h4>

                {overview.status === "loading" ? (
                  <p className="animate-pulse rounded-2xl bg-card-2 p-5 text-base text-foreground/75">
                    {t("skills.loading")}…
                  </p>
                ) : projects.length === 0 ? (
                  <p className="rounded-2xl bg-card-2 p-5 text-base text-foreground/80">
                    {overview.status === "error" ? t("projects.githubError") : t("skills.editorEmpty")}
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {projects.map((repo) => (
                      <li key={repo.id} className="flex flex-col rounded-2xl bg-card-2 p-5 shadow-sm">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <span className="line-clamp-1 font-display text-base font-bold text-foreground">
                            {repo.name}
                          </span>
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t("projects.github")}: ${repo.name}`}
                            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-primary-dark/20 px-3.5 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-primary-dark/35"
                          >
                            {t("projects.github")}
                          </a>
                        </div>
                        <p className="mb-3 grow text-base leading-relaxed text-foreground/80">
                          {repo.description ?? t("projects.noDescription")}
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {repo.language && <li className="rounded-full bg-primary-dark/15 px-2.5 py-1 text-xs font-semibold text-foreground/80">{repo.language}</li>}
                          <li className="rounded-full bg-primary-dark/15 px-2.5 py-1 text-xs font-semibold text-foreground/80">★ {repo.stars}</li>
                          <li className="rounded-full bg-primary-dark/15 px-2.5 py-1 text-xs font-semibold text-foreground/80">
                            {formatRelative(repo.pushedAt, now)} {t("skills.editorUpdated")}
                          </li>
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
