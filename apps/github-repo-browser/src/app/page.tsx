"use client";

import { useEffect, useMemo, useState } from "react";

type GitHubRepo = {
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

const PAGE_SIZE = 10;
const MAX_PAGE = 3;
const GITHUB_REPOS_URL = "https://api.github.com/orgs/github/repos";

const numberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatCount(value: number) {
  return numberFormatter.format(value);
}

function formatUpdatedDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [reposByPage, setReposByPage] = useState<Record<number, GitHubRepo[]>>(
    {},
  );
  const [errorsByPage, setErrorsByPage] = useState<Record<number, string>>({});
  const [retryKey, setRetryKey] = useState(0);

  const repos = reposByPage[page] ?? [];
  const error = errorsByPage[page] ?? null;
  const isLoading = repos.length === 0 && !error;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < MAX_PAGE;

  const repoRange = useMemo(() => {
    const first = (page - 1) * PAGE_SIZE + 1;
    const last = first + Math.max(repos.length - 1, 0);

    return repos.length > 0 ? `${first}-${last}` : "0";
  }, [page, repos.length]);

  useEffect(() => {
    if (reposByPage[page] || errorsByPage[page]) {
      return;
    }

    const controller = new AbortController();

    async function fetchRepos() {
      const params = new URLSearchParams({
        sort: "name",
        per_page: String(PAGE_SIZE),
        page: String(page),
      });

      try {
        const response = await fetch(`${GITHUB_REPOS_URL}?${params}`, {
          headers: {
            Accept: "application/vnd.github+json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`GitHub responded with ${response.status}.`);
        }

        const data = (await response.json()) as GitHubRepo[];
        setReposByPage((current) => ({ ...current, [page]: data }));
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorsByPage((current) => ({
          ...current,
          [page]:
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load repositories.",
        }));
      }
    }

    void fetchRepos();

    return () => controller.abort();
  }, [errorsByPage, page, reposByPage, retryKey]);

  function goToPreviousPage() {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }

  function goToNextPage() {
    setPage((currentPage) => Math.min(MAX_PAGE, currentPage + 1));
  }

  function retryFetch() {
    setReposByPage((current) => {
      const next = { ...current };
      delete next[page];
      return next;
    });
    setErrorsByPage((current) => {
      const next = { ...current };
      delete next[page];
      return next;
    });
    setRetryKey((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-[#24292f]">
      <section className="border-b border-[#d0d7de] bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#57606a]">
                GitHub organization
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#0969da]">
                github repositories
              </h1>
            </div>
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-4 text-sm font-medium text-[#24292f] hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2"
              href="https://github.com/github"
              rel="noreferrer"
              target="_blank"
            >
              View organization
            </a>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[#57606a]">
            Browse the first 30 public repositories from GitHub&apos;s
            organization listing, sorted by repository name.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="repository-list-heading"
        className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-4 flex flex-col gap-3 border-b border-[#d0d7de] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="repository-list-heading"
              className="text-xl font-semibold text-[#24292f]"
            >
              Repositories
            </h2>
            <p className="mt-1 text-sm text-[#57606a]" aria-live="polite">
              Showing {repoRange} of at least {PAGE_SIZE * MAX_PAGE} results.
            </p>
          </div>
          <div className="flex items-center gap-2" aria-label="Pagination">
            <button
              className="h-9 rounded-md border border-[#d0d7de] bg-white px-3 text-sm font-medium text-[#0969da] hover:bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-[#8c959f] disabled:opacity-70"
              disabled={!hasPreviousPage || isLoading}
              onClick={goToPreviousPage}
              type="button"
            >
              Previous
            </button>
            <span className="min-w-20 text-center text-sm text-[#57606a]">
              Page {page} of {MAX_PAGE}
            </span>
            <button
              className="h-9 rounded-md border border-[#d0d7de] bg-white px-3 text-sm font-medium text-[#0969da] hover:bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-[#8c959f] disabled:opacity-70"
              disabled={!hasNextPage || isLoading}
              onClick={goToNextPage}
              type="button"
            >
              Next
            </button>
          </div>
        </div>

        {error ? (
          <div
            className="rounded-md border border-[#f85149] bg-white p-5"
            role="alert"
          >
            <h3 className="text-base font-semibold text-[#cf222e]">
              Repositories could not be loaded.
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#57606a]">{error}</p>
            <button
              className="mt-4 h-9 rounded-md border border-[#d0d7de] bg-[#2da44e] px-3 text-sm font-medium text-white hover:bg-[#2c974b] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2"
              onClick={retryFetch}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!error && isLoading ? <RepositoryLoadingList /> : null}

        {!error && !isLoading && repos.length === 0 ? (
          <div className="rounded-md border border-[#d0d7de] bg-white p-5">
            <p className="text-sm text-[#57606a]">
              No repositories were returned for this page.
            </p>
          </div>
        ) : null}

        {!error && !isLoading && repos.length > 0 ? (
          <ul className="divide-y divide-[#d0d7de] rounded-md border border-[#d0d7de] bg-white">
            {repos.map((repo) => (
              <RepositoryListItem key={repo.id} repo={repo} />
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}

function RepositoryListItem({ repo }: { repo: GitHubRepo }) {
  return (
    <li className="p-5">
      <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold leading-7">
              <a
                className="break-words text-[#0969da] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2"
                href={repo.html_url}
                rel="noreferrer"
                target="_blank"
              >
                {repo.name}
              </a>
            </h3>
            <span className="rounded-full border border-[#d0d7de] px-2 py-0.5 text-xs font-medium text-[#57606a]">
              {repo.private ? "Private" : "Public"}
            </span>
            {repo.fork ? (
              <span className="rounded-full border border-[#d0d7de] px-2 py-0.5 text-xs font-medium text-[#57606a]">
                Fork
              </span>
            ) : null}
          </div>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#57606a]">
            {repo.description || "No description provided."}
          </p>

          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#57606a]">
            {repo.language ? (
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Primary language</dt>
                <dd className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full bg-[#0969da]"
                  />
                  {repo.language}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="sr-only">Stars</dt>
              <dd>{formatCount(repo.stargazers_count)} stars</dd>
            </div>
            <div>
              <dt className="sr-only">Forks</dt>
              <dd>{formatCount(repo.forks_count)} forks</dd>
            </div>
            <div>
              <dt className="sr-only">Last updated</dt>
              <dd>Updated {formatUpdatedDate(repo.updated_at)}</dd>
            </div>
          </dl>
        </div>
      </article>
    </li>
  );
}

function RepositoryLoadingList() {
  return (
    <div
      aria-label="Loading repositories"
      className="divide-y divide-[#d0d7de] rounded-md border border-[#d0d7de] bg-white"
      role="status"
    >
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <div className="p-5" key={index}>
          <div className="h-5 w-44 rounded-md bg-[#d8dee4]" />
          <div className="mt-3 h-4 w-full max-w-xl rounded-md bg-[#d8dee4]" />
          <div className="mt-2 h-4 w-2/3 max-w-lg rounded-md bg-[#d8dee4]" />
          <div className="mt-4 flex gap-3">
            <div className="h-3 w-20 rounded-md bg-[#d8dee4]" />
            <div className="h-3 w-16 rounded-md bg-[#d8dee4]" />
            <div className="h-3 w-24 rounded-md bg-[#d8dee4]" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading repositories</span>
    </div>
  );
}
