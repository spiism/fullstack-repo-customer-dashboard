"use client";

import Link from "next/link";
import { getPageHref } from "../lib/pagination";
import { markRepositoryNavigation } from "./repository-results-header";

type PaginationControlsProps = {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number | null;
};

const pageLinkClass =
  "flex h-9 min-w-0 items-center justify-center rounded-md border border-github-border bg-white px-2 text-sm font-medium text-github-accent hover:bg-github-canvas focus:outline-none focus:ring-2 focus:ring-github-accent focus:ring-offset-2 sm:px-3";

const disabledPageClass =
  "flex h-9 min-w-0 cursor-not-allowed items-center justify-center rounded-md border border-github-border bg-white px-2 text-sm font-medium text-github-subtle opacity-70 sm:px-3";

export function PaginationControls({
  currentPage,
  hasNextPage,
  totalPages,
}: PaginationControlsProps) {
  const hasPreviousPage = currentPage > 1;
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav
      aria-label="Repository pagination"
      className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:w-auto sm:grid-cols-[auto_auto_auto]"
    >
      {hasPreviousPage ? (
        <Link
          className={pageLinkClass}
          href={getPageHref(previousPage)}
          onNavigate={markRepositoryNavigation}
        >
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledPageClass}>
          Previous
        </span>
      )}
      <span className="min-w-20 text-center text-sm text-github-muted">
        {totalPages ? `Page ${currentPage} of ${totalPages}` : `Page ${currentPage}`}
      </span>
      {hasNextPage ? (
        <Link
          className={pageLinkClass}
          href={getPageHref(nextPage)}
          onNavigate={markRepositoryNavigation}
        >
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledPageClass}>
          Next
        </span>
      )}
    </nav>
  );
}
