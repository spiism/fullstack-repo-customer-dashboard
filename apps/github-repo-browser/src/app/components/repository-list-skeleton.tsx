import { PAGE_SIZE } from "../lib/pagination";

export function RepositoryListSkeleton() {
  return (
    <div
      aria-label="Loading repositories"
      className="divide-y divide-github-border rounded-md border border-github-border bg-white"
      role="status"
    >
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <div className="p-4 sm:p-5" key={index}>
          <div className="h-5 w-36 rounded-md bg-github-skeleton sm:w-44" />
          <div className="mt-3 h-4 w-full max-w-xl rounded-md bg-github-skeleton" />
          <div className="mt-2 h-4 w-2/3 max-w-lg rounded-md bg-github-skeleton" />
          <div className="mt-4 grid grid-cols-2 gap-3 min-[420px]:flex">
            <div className="h-3 w-20 rounded-md bg-github-skeleton" />
            <div className="h-3 w-16 rounded-md bg-github-skeleton" />
            <div className="h-3 w-24 rounded-md bg-github-skeleton" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading repositories</span>
    </div>
  );
}
