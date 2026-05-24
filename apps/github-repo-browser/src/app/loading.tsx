import { RepositoryListSkeleton } from "./components/repository-list-skeleton";
import { SiteHeader } from "./components/site-header";

export default function Loading() {
  return (
    <main className="min-h-screen bg-github-canvas text-github-fg">
      <SiteHeader />

      <section
        aria-labelledby="repository-list-heading"
        aria-busy="true"
        className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        <div className="mb-4 flex flex-col gap-4 border-b border-github-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2
              className="text-xl font-semibold text-github-fg"
              id="repository-list-heading"
            >
              Repositories
            </h2>
            <p className="mt-1 text-sm text-github-muted">
              Loading repositories.
            </p>
          </div>
        </div>
        <RepositoryListSkeleton />
      </section>
    </main>
  );
}
