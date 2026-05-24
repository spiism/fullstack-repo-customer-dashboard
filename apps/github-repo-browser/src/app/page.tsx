"use client";

import { useMemo, useState } from "react";
import {
  MAX_PAGE,
  PAGE_SIZE,
  type GitHubRepo,
  useGithubRepos,
} from "./use-github-repos";

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
  const { repos, status, error, retry } = useGithubRepos(page);
  const isLoading = status === "idle" || status === "loading";
  const isError = status === "error";
  const isEmpty = status === "success" && repos.length === 0;
  const hasRepos = status === "success" && repos.length > 0;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < MAX_PAGE;

  const repoRange = useMemo(() => {
    const first = (page - 1) * PAGE_SIZE + 1;
    const last = first + Math.max(repos.length - 1, 0);

    return repos.length > 0 ? `${first}-${last}` : "0";
  }, [page, repos.length]);

  function goToPreviousPage() {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }

  function goToNextPage() {
    setPage((currentPage) => Math.min(MAX_PAGE, currentPage + 1));
  }

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-[#24292f]">
      <section className="border-b border-[#d0d7de] bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:items-center">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#57606a]">
                GitHub organization
              </p>
              <h1 className="mt-2 break-words text-2xl font-semibold text-[#0969da] sm:text-3xl">
                github repositories
              </h1>
            </div>
            <a
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-4 text-sm font-medium text-[#24292f] hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2 sm:w-auto sm:shrink-0"
              href="https://github.com/github"
              rel="noreferrer"
              target="_blank"
            >
              View organization
            </a>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[#57606a] sm:text-base sm:leading-7">
            Browse the first 30 public repositories from GitHub&apos;s
            organization listing, sorted by repository name.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="repository-list-heading"
        aria-busy={isLoading}
        className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        <div className="mb-4 flex flex-col gap-4 border-b border-[#d0d7de] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
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
          <nav
            aria-label="Repository pagination"
            className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:w-auto sm:grid-cols-[auto_auto_auto]"
          >
            <button
              className="h-9 min-w-0 rounded-md border border-[#d0d7de] bg-white px-2 text-sm font-medium text-[#0969da] hover:bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-[#8c959f] disabled:opacity-70 sm:px-3"
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
              className="h-9 min-w-0 rounded-md border border-[#d0d7de] bg-white px-2 text-sm font-medium text-[#0969da] hover:bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-[#8c959f] disabled:opacity-70 sm:px-3"
              disabled={!hasNextPage || isLoading}
              onClick={goToNextPage}
              type="button"
            >
              Next
            </button>
          </nav>
        </div>

        {isError ? (
          <div
            className="rounded-md border border-[#f85149] bg-white p-5"
            role="alert"
          >
            <h3 className="text-base font-semibold text-[#cf222e]">
              Repositories could not be loaded.
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#57606a]">
              {error ?? "Unable to load repositories."}
            </p>
            <button
              className="mt-4 h-9 rounded-md border border-[#d0d7de] bg-[#2da44e] px-3 text-sm font-medium text-white hover:bg-[#2c974b] focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:ring-offset-2"
              onClick={retry}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}

        {isLoading ? <RepositoryLoadingList /> : null}

        {isEmpty ? (
          <div className="rounded-md border border-[#d0d7de] bg-white p-5">
            <p className="text-sm text-[#57606a]">
              No repositories were returned for this page.
            </p>
          </div>
        ) : null}

        {hasRepos ? (
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
    <li className="p-4 sm:p-5">
      <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 text-base font-semibold leading-7 sm:text-lg">
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

          <dl className="mt-4 grid gap-x-5 gap-y-2 text-xs text-[#57606a] min-[420px]:grid-cols-2 sm:flex sm:flex-wrap">
            {repo.language ? (
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Primary language</dt>
                <dd className="flex min-w-0 items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full bg-[#0969da]"
                  />
                  <span className="truncate">{repo.language}</span>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="sr-only">Stars</dt>
              <dd className="flex items-center gap-1.5">
                <StarIcon />
                {formatCount(repo.stargazers_count)} stars
              </dd>
            </div>
            <div>
              <dt className="sr-only">Forks</dt>
              <dd className="flex items-center gap-1.5">
                <ForkIcon />
                {formatCount(repo.forks_count)} forks
              </dd>
            </div>
            <div>
              <dt className="sr-only">Last updated</dt>
              <dd className="flex items-center gap-1.5">
                <ClockIcon />
                Updated {formatUpdatedDate(repo.updated_at)}
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </li>
  );
}

function MetaIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-[#57606a]"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      {children}
    </svg>
  );
}

function StarIcon() {
  return (
    <MetaIcon>
      <path d="M8 .75a.75.75 0 0 1 .67.41l1.88 3.81 4.2.61a.75.75 0 0 1 .42 1.28l-3.04 2.96.72 4.18a.75.75 0 0 1-1.09.79L8 12.81l-3.76 1.98a.75.75 0 0 1-1.09-.79l.72-4.18L.83 6.86a.75.75 0 0 1 .42-1.28l4.2-.61 1.88-3.81A.75.75 0 0 1 8 .75Z" />
    </MetaIcon>
  );
}

function ForkIcon() {
  return (
    <MetaIcon>
      <path d="M5 3.25a1.75 1.75 0 1 1-2.5-1.58 1.75 1.75 0 0 1 2.5 1.58Zm-1.75-.25a.25.25 0 1 0 .5 0 .25.25 0 0 0-.5 0Zm9.25.25a1.75 1.75 0 0 1-2.5 1.58 1.75 1.75 0 1 1 2.5-1.58Zm-1.75-.25a.25.25 0 1 0 .5 0 .25.25 0 0 0-.5 0ZM8.75 11.1a1.75 1.75 0 1 1-1.5 0V9.5a2 2 0 0 1 2-2h1a.5.5 0 0 0 .5-.5V4.5h1.5V7a2 2 0 0 1-2 2h-1a.5.5 0 0 0-.5.5v1.6Zm-.75 1.4a.25.25 0 1 0 0 .5.25.25 0 0 0 0-.5ZM3.75 4.5h-1.5v2.75A2.75 2.75 0 0 0 5 10h1v-1.5H5a1.25 1.25 0 0 1-1.25-1.25V4.5Z" />
    </MetaIcon>
  );
}

function ClockIcon() {
  return (
    <MetaIcon>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8.75-3.25v2.96l2.02 1.21a.75.75 0 0 1-.77 1.29L7.61 8.78A.75.75 0 0 1 7.25 8V4.75a.75.75 0 0 1 1.5 0Z" />
    </MetaIcon>
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
        <div className="p-4 sm:p-5" key={index}>
          <div className="h-5 w-36 rounded-md bg-[#d8dee4] sm:w-44" />
          <div className="mt-3 h-4 w-full max-w-xl rounded-md bg-[#d8dee4]" />
          <div className="mt-2 h-4 w-2/3 max-w-lg rounded-md bg-[#d8dee4]" />
          <div className="mt-4 grid grid-cols-2 gap-3 min-[420px]:flex">
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
