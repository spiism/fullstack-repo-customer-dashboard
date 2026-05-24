export function SiteHeader() {
  return (
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
  );
}
