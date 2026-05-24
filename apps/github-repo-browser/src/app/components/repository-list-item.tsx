import type { GitHubRepo } from "../lib/github-repos";
import { ClockIcon, ForkIcon, StarIcon } from "./icons";

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

export function RepositoryListItem({ repo }: { repo: GitHubRepo }) {
  return (
    <li className="p-4 sm:p-5">
      <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 text-base font-semibold leading-7 sm:text-lg">
              <a
                className="break-words text-github-accent hover:underline focus:outline-none focus:ring-2 focus:ring-github-accent focus:ring-offset-2"
                href={repo.html_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {repo.name}
              </a>
            </h3>
            <span className="rounded-full border border-github-border px-2 py-0.5 text-xs font-medium text-github-muted">
              {repo.private ? "Private" : "Public"}
            </span>
            {repo.fork ? (
              <span className="rounded-full border border-github-border px-2 py-0.5 text-xs font-medium text-github-muted">
                Fork
              </span>
            ) : null}
          </div>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-github-muted">
            {repo.description || "No description provided."}
          </p>

          <dl className="mt-4 grid gap-x-5 gap-y-2 text-xs text-github-muted min-[420px]:grid-cols-2 sm:flex sm:flex-wrap">
            {repo.language ? (
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Primary language</dt>
                <dd className="flex min-w-0 items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full bg-github-accent"
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
