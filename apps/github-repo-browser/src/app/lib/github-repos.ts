import { PAGE_SIZE } from "./pagination";

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export type GitHubReposResult =
  | {
      status: "success";
      repos: GitHubRepo[];
      hasNextPage: boolean;
      totalPages: number | null;
    }
  | {
      status: "error";
      error: string;
      hasNextPage: boolean;
      totalPages: number | null;
    };

const GITHUB_REPOS_URL = "https://api.github.com/orgs/github/repos";
const FETCH_REVALIDATE_SECONDS = 60;

type GitHubPageLinks = Partial<{
  first: number;
  prev: number;
  next: number;
  last: number;
}>;

export function parseGitHubLinkHeader(header: string | null) {
  if (!header) {
    return {};
  }

  return header.split(",").reduce<GitHubPageLinks>((links, entry) => {
    const match = entry.match(/<([^>]+)>;\s*rel="([^"]+)"/);

    if (!match) {
      return links;
    }

    const [, linkUrl, rel] = match;
    const page = Number(
      new URL(linkUrl, GITHUB_REPOS_URL).searchParams.get("page"),
    );

    if (Number.isInteger(page) && page > 0) {
      links[rel as keyof GitHubPageLinks] = page;
    }

    return links;
  }, {});
}

export async function getGithubReposPage(
  page: number,
): Promise<GitHubReposResult> {
  const params = new URLSearchParams({
    sort: "name",
    per_page: String(PAGE_SIZE),
    page: String(page),
  });

  const response = await fetch(`${GITHUB_REPOS_URL}?${params}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
    next: {
      revalidate: FETCH_REVALIDATE_SECONDS,
    },
  });

  const links = parseGitHubLinkHeader(response.headers.get("link"));

  if (!response.ok) {
    return {
      status: "error",
      error: getGitHubErrorMessage(response),
      hasNextPage: Boolean(links.next),
      totalPages: links.last ?? null,
    };
  }

  const repos = (await response.json()) as GitHubRepo[];

  return {
    status: "success",
    repos,
    hasNextPage: Boolean(links.next),
    totalPages: links.last ?? null,
  };
}

function getGitHubErrorMessage(response: Response) {
  const remaining = response.headers.get("x-ratelimit-remaining");

  if (response.status === 403 && remaining === "0") {
    const resetTime = formatRateLimitReset(
      response.headers.get("x-ratelimit-reset"),
    );

    return resetTime
      ? `GitHub API rate limit reached. Try again after ${resetTime}.`
      : "GitHub API rate limit reached. Try again later.";
  }

  return `GitHub responded with ${response.status}.`;
}

function formatRateLimitReset(resetHeader: string | null) {
  if (!resetHeader) {
    return null;
  }

  const resetDate = new Date(Number(resetHeader) * 1000);

  if (Number.isNaN(resetDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(resetDate);
}
