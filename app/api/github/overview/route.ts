import { NextResponse } from "next/server";

const USERNAME = "NicolMunoz012";

type GithubRepo = {
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
};

type GithubPushEvent = {
  type: "PushEvent";
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: Array<{
      sha: string;
      message: string;
    }>;
  };
};

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-nicol",
    
  };
}

export async function GET() {
  const reposUrl = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`;
  const eventsUrl = `https://api.github.com/users/${USERNAME}/events/public?per_page=30`;

  const [reposRes, eventsRes] = await Promise.all([
    fetch(reposUrl, { headers: githubHeaders(), next: { revalidate: 600 } }),
    fetch(eventsUrl, { headers: githubHeaders(), next: { revalidate: 120 } }),
  ]);

  if (!reposRes.ok) {
    return NextResponse.json(
      { error: "github_repos_failed" },
      {
        status: 502,
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" },
      },
    );
  }

  const reposRaw = (await reposRes.json()) as GithubRepo[];

  const baseRepos = reposRaw.filter((r) => !r.fork && !r.archived);

  const repoSummary = (r: GithubRepo) => ({
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
  });

  const allRepos = baseRepos
    .slice()
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 30)
    .map(repoSummary);

  const repos = baseRepos
    .slice()
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    })
    .slice(0, 6)
    .map(repoSummary);

  let commits: Array<{
    repo: string;
    sha: string;
    message: string;
    url: string;
    createdAt: string;
  }> = [];

  if (eventsRes.ok) {
    const eventsRaw = (await eventsRes.json()) as Array<GithubPushEvent | { type: string }>;
    const pushEvents = eventsRaw.filter((e): e is GithubPushEvent => e.type === "PushEvent");

    commits = pushEvents
      .flatMap((e) => {
        const repo = e.repo.name;
        const createdAt = e.created_at;
        const list = e.payload.commits ?? [];
        return list.map((c) => ({
          repo,
          sha: c.sha,
          message: c.message,
          url: `https://github.com/${repo}/commit/${c.sha}`,
          createdAt,
        }));
      })
      .slice(0, 12);
  }

  return NextResponse.json(
    { username: USERNAME, repos, allRepos, commits },
    {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
    },
  );
}
