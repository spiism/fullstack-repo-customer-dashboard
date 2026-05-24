import type { GitHubReposResult } from "../lib/github-repos";
import { getPageHref, PAGE_SIZE } from "../lib/pagination";
import { PaginationControls } from "./pagination-controls";
import { RepositoryListItem } from "./repository-list-item";
import { RepositoryResultsHeader } from "./repository-results-header";

type RepositoryBrowserProps = {
  currentPage: number;
  result: GitHubReposResult;
};

function getRepoRange(page: number, repoCount: number) {
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = first + Math.max(repoCount - 1, 0);

  return repoCount > 0 ? `${first}-${last}` : "0";
}

export function RepositoryBrowser({
  currentPage,
  result,
}: RepositoryBrowserProps) {
  const repos = result.status === "success" ? result.repos : [];
  const repoRange = getRepoRange(currentPage, repos.length);
  const hasRepos = result.status === "success" && repos.length > 0;
  const isEmpty = result.status === "success" && repos.length === 0;

  return (
    <main className="min-h-screen bg-github-canvas text-github-fg">
      <section className="border-b border-github-border bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:items-center">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-github-muted">
                GitHub organization
              </p>
              <h1 className="mt-2 break-words text-2xl font-semibold text-github-accent sm:text-3xl">
                github repositories
              </h1>
            </div>
            <a
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-github-border bg-github-canvas px-4 text-sm font-medium text-github-fg hover:bg-github-hover focus:outline-none focus:ring-2 focus:ring-github-accent focus:ring-offset-2 sm:w-auto sm:shrink-0"
              href="https://github.com/github"
              rel="noopener noreferrer"
              target="_blank"
            >
              View organization
            </a>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-github-muted sm:text-base sm:leading-7">
            Browse public repositories from GitHub&apos;s organization listing,
            sorted by repository name.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="repository-list-heading"
        className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        <div className="mb-4 flex flex-col gap-4 border-b border-github-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <RepositoryResultsHeader
            currentPage={currentPage}
            rangeLabel={repoRange}
            repoCount={repos.length}
            totalPages={result.totalPages}
          />
          <PaginationControls
            currentPage={currentPage}
            hasNextPage={result.hasNextPage}
            totalPages={result.totalPages}
          />
        </div>

        {result.status === "error" ? (
          <div
            className="rounded-md border border-github-danger-border bg-white p-5"
            role="alert"
          >
            <h3 className="text-base font-semibold text-github-danger">
              Repositories could not be loaded.
            </h3>
            <p className="mt-2 text-sm leading-6 text-github-muted">
              {result.error}
            </p>
            <a
              className="mt-4 inline-flex h-9 items-center rounded-md border border-github-border bg-github-success px-3 text-sm font-medium text-white hover:bg-github-success-hover focus:outline-none focus:ring-2 focus:ring-github-accent focus:ring-offset-2"
              href={getPageHref(currentPage)}
            >
              Retry
            </a>
          </div>
        ) : null}

        {isEmpty ? (
          <div className="rounded-md border border-github-border bg-white p-5">
            <p className="text-sm text-github-muted">
              No repositories were returned for this page.
            </p>
          </div>
        ) : null}

        {hasRepos ? (
          <ul className="divide-y divide-github-border rounded-md border border-github-border bg-white">
            {repos.map((repo) => (
              <RepositoryListItem key={repo.id} repo={repo} />
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
