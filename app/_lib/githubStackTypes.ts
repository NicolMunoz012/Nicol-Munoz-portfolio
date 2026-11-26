export type SkillTag = "java" | "spring" | "python" | "ia" | "react" | "next" | "tailwind";

export type RepoStack = {
  /** Tecnologías que usa el repo. */
  stack: SkillTag[];
  /** Las que solo se dedujeron del nombre del repo, sin dependencias que lo confirmen: van al final. */
  weak: SkillTag[];
};
