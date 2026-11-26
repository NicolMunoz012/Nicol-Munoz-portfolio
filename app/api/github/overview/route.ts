import { NextResponse } from "next/server";
import { GITHUB_USERNAME } from "../../../_lib/links";

type GithubApiRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  updated_at: string;
  archived: boolean;
  fork: boolean;
  homepage: string | null;
  owner: { login: string };
};

const ERROR_CACHE = "public, s-maxage=60, stale-while-revalidate=600";
const OK_CACHE = "public, s-maxage=300, stale-while-revalidate=3600";

function sanitizeUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-nicol",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

function failure() {
  return NextResponse.json(
    { error: "github_repos_failed" },
    { status: 502, headers: { "Cache-Control": ERROR_CACHE } },
  );
}

const byPushedDesc = (a: GithubApiRepo, b: GithubApiRepo) =>
  new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();

export async function GET() {
  const reposUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed&type=all`;

  let reposRaw: GithubApiRepo[];
  try {
    // Sin token GitHub permite 60 peticiones/hora por IP: se cachea 5 minutos.
    const res = await fetch(reposUrl, { headers: githubHeaders(), next: { revalidate: 300 } });
    if (!res.ok) return failure();
    reposRaw = (await res.json()) as GithubApiRepo[];
  } catch {
    return failure();
  }

  const baseRepos = reposRaw.filter((r) => !r.fork && !r.archived);

  const summarize = (r: GithubApiRepo) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    url: r.html_url,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    pushedAt: r.pushed_at,
    updatedAt: r.updated_at,
    homepage: sanitizeUrl(r.homepage),
    collaboration: r.owner.login.toLowerCase() !== GITHUB_USERNAME.toLowerCase(),
  });

  const allRepos = baseRepos.slice().sort(byPushedDesc).slice(0, 40).map(summarize);

  // Los destacados de Proyectos siguen siendo solo repos propios.
  const repos = baseRepos
    .filter((r) => r.owner.login.toLowerCase() === GITHUB_USERNAME.toLowerCase())
    .sort((a, b) => b.stargazers_count - a.stargazers_count || byPushedDesc(a, b))
    .slice(0, 6)
    .map(summarize);

  return NextResponse.json(
    { username: GITHUB_USERNAME, repos, allRepos },
    { headers: { "Cache-Control": OK_CACHE } },
  );
}
