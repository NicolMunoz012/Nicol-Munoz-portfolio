// Solo servidor: lo usa app/api/github/overview/route.ts.
import { unstable_cache } from "next/cache";
import type { RepoStack, SkillTag } from "./githubStackTypes";

export type StackRepo = {
  full_name: string;
  name: string;
  language: string | null;
  default_branch: string;
  pushed_at: string;
};

type Mode = "tree" | "root";

const REQUEST_TIMEOUT = 5000;
const MAX_MANIFESTS = 6;
const ONE_WEEK = 60 * 60 * 24 * 7;
/** Subirlo cuando cambien las reglas de detección, para invalidar los resultados guardados. */
const CACHE_VERSION = "gh-stack-v2";

const IGNORED_DIRS = new Set(["node_modules", "vendor", "dist", "build", "target", ".venv", "venv", "site-packages", ".next", "out"]);
const ROOT_MANIFESTS = ["package.json", "pom.xml", "build.gradle", "build.gradle.kts", "requirements.txt", "pyproject.toml"];
const MANIFEST_NAME = /^(package\.json|pom\.xml|build\.gradle(\.kts)?|requirements[\w.-]*\.txt|pyproject\.toml)$/;

const AI_PYTHON =
  /(^|[\s"'[,])(tensorflow|torch|keras|scikit-learn|sklearn|transformers|openai|anthropic|langchain[\w-]*|groq|google-generativeai|xgboost)(?=[\s"'=<>~!;[\],]|$)/m;
const AI_JS = /^(openai|@anthropic-ai\/sdk|@google\/generative-ai|ai|@ai-sdk\/.+|langchain|@langchain\/.+|@tensorflow\/.+|groq-sdk)$/;
const AI_NAME_TOKENS = new Set(["ia", "ai", "ml"]);

const basename = (path: string) => path.slice(path.lastIndexOf("/") + 1);
const isIgnored = (path: string) => path.split("/").some((segment) => IGNORED_DIRS.has(segment));

async function listManifests(repo: StackRepo, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/${repo.full_name}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "portfolio-nicol",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    },
  );
  if (!res.ok) throw new Error(`tree_${res.status}`);
  const data = (await res.json()) as { tree?: { path: string; type: string }[] };
  const files = (data.tree ?? []).filter((entry) => entry.type === "blob" && !isIgnored(entry.path)).map((entry) => entry.path);

  return {
    manifests: files
      .filter((path) => MANIFEST_NAME.test(basename(path)))
      .sort((a, b) => a.split("/").length - b.split("/").length)
      .slice(0, MAX_MANIFESTS),
    hasJava: files.some((path) => path.endsWith(".java")),
    hasPython: files.some((path) => path.endsWith(".py")),
  };
}

async function readFile(repo: StackRepo, path: string): Promise<string | null> {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${repo.full_name}/${encodeURIComponent(repo.default_branch)}/${encodedPath}`,
      { cache: "no-store", signal: AbortSignal.timeout(REQUEST_TIMEOUT) },
    );
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

function packageDependencies(content: string): string[] {
  try {
    const pkg = JSON.parse(content) as { dependencies?: object; devDependencies?: object };
    return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  } catch {
    return [];
  }
}

function nameTokens(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s._-]+/)
    .map((token) => token.toLowerCase());
}

async function analyze(repo: StackRepo, mode: Mode, token: string | undefined): Promise<RepoStack> {
  let manifests = ROOT_MANIFESTS;
  let hasJava = false;
  let hasPython = false;

  if (mode === "tree" && token) {
    // Si el árbol falla, el error sale de la caché para no guardar un resultado incompleto.
    ({ manifests, hasJava, hasPython } = await listManifests(repo, token));
  }

  const files = (await Promise.all(manifests.map(async (path) => ({ path, content: await readFile(repo, path) })))).filter(
    (file): file is { path: string; content: string } => file.content !== null,
  );

  const tags = new Set<SkillTag>();
  const language = (repo.language ?? "").toLowerCase();

  for (const { path, content } of files) {
    const file = basename(path);

    if (file === "package.json") {
      const deps = packageDependencies(content);
      if (deps.includes("next")) tags.add("next");
      if (deps.includes("react")) tags.add("react");
      if (deps.some((dep) => dep === "tailwindcss" || dep.startsWith("@tailwindcss/"))) tags.add("tailwind");
      if (deps.some((dep) => AI_JS.test(dep))) tags.add("ia");
    } else if (file === "pom.xml" || file.startsWith("build.gradle")) {
      // Maven es Java; Gradle también se usa para Android/Kotlin, así que solo cuenta con otra señal de Java.
      if (file === "pom.xml") tags.add("java");
      if (content.includes("org.springframework")) tags.add("java").add("spring");
    } else {
      tags.add("python");
      if (AI_PYTHON.test(content.toLowerCase())) tags.add("ia");
    }
  }

  if (language === "java" || hasJava) tags.add("java");
  if (language === "python" || language === "jupyter notebook" || hasPython) tags.add("python");
  const weak: SkillTag[] = [];
  if (!tags.has("ia") && nameTokens(repo.name).some((token) => AI_NAME_TOKENS.has(token))) {
    tags.add("ia");
    weak.push("ia");
  }

  return { stack: [...tags], weak };
}

function cachedAnalysis(repo: StackRepo, mode: Mode, token: string | undefined) {
  return unstable_cache(() => analyze(repo, mode, token), [CACHE_VERSION, repo.full_name, repo.pushed_at, mode], {
    revalidate: ONE_WEEK,
  })();
}

/** Tecnologías que usa un repo según sus archivos de dependencias. Se recalcula solo cuando el repo recibe un push. */
export async function detectStack(repo: StackRepo): Promise<RepoStack> {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    try {
      return await cachedAnalysis(repo, "tree", token);
    } catch {
      // Sin árbol (límite de la API, timeout…): se analizan solo los archivos de la raíz.
    }
  }
  try {
    return await cachedAnalysis(repo, "root", undefined);
  } catch {
    return { stack: [], weak: [] };
  }
}

/** Ejecuta `task` sobre cada elemento con como máximo `limit` tareas a la vez. */
export async function mapWithLimit<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
