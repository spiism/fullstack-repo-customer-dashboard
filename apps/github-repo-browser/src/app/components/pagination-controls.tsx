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
  "flex h-9 min-w-0 items-center justify-center rounded-md border border-github-border bg-github-canvas px-2.5 text-sm font-medium text-github-accent hover:border-github-accent hover:bg-white focus:outline-none focus:ring-2 focus:ring-github-accent focus:ring-offset-2";

const disabledPageClass =
  "flex h-9 min-w-0 cursor-not-allowed items-center justify-center rounded-md border border-github-border bg-github-canvas px-2.5 text-sm font-medium text-github-subtle opacity-70";

const pageNumberLinkClass =
  "flex h-9 min-w-9 items-center justify-center rounded-md border border-github-border bg-white px-2 text-sm font-medium text-github-accent hover:bg-github-canvas focus:outline-none focus:ring-2 focus:ring-github-accent focus:ring-offset-2";

const currentPageClass =
  "flex h-9 min-w-9 items-center justify-center rounded-md border border-github-accent bg-github-accent px-2 text-sm font-medium text-white";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(currentPage: number, totalPages: number) {
  const visiblePages = new Set<number>([1, totalPages]);
  const windowStart = Math.max(1, currentPage - 2);
  const windowEnd = Math.min(totalPages, currentPage + 2);

  for (let page = windowStart; page <= windowEnd; page += 1) {
    visiblePages.add(page);
  }

  const pages = Array.from(visiblePages).sort((first, second) => first - second);

  return pages.reduce<PageItem[]>((items, page, index) => {
    const previousPage = pages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push(index === 1 ? "ellipsis-start" : "ellipsis-end");
    }

    items.push(page);
    return items;
  }, []);
}

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
      className="flex w-full flex-wrap items-center justify-center gap-1.5 sm:w-auto sm:justify-end"
    >
      {hasPreviousPage ? (
        <Link
          className={pageLinkClass}
          href={getPageHref(1)}
          onNavigate={markRepositoryNavigation}
        >
          First
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledPageClass}>
          First
        </span>
      )}
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

      {totalPages ? (
        <ol className="contents">
          {getPageItems(currentPage, totalPages).map((pageItem) =>
            typeof pageItem === "number" ? (
              <li key={pageItem}>
                {pageItem === currentPage ? (
                  <span aria-current="page" className={currentPageClass}>
                    {pageItem}
                  </span>
                ) : (
                  <Link
                    aria-label={`Go to page ${pageItem}`}
                    className={pageNumberLinkClass}
                    href={getPageHref(pageItem)}
                    onNavigate={markRepositoryNavigation}
                  >
                    {pageItem}
                  </Link>
                )}
              </li>
            ) : (
              <li
                aria-hidden="true"
                className="flex h-9 min-w-7 items-center justify-center text-sm text-github-muted"
                key={pageItem}
              >
                ...
              </li>
            ),
          )}
        </ol>
      ) : (
        <span className="text-center text-sm text-github-muted sm:text-right">
          Page {currentPage}
        </span>
      )}

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
      {totalPages && currentPage < totalPages ? (
        <Link
          className={pageLinkClass}
          href={getPageHref(totalPages)}
          onNavigate={markRepositoryNavigation}
        >
          Last
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledPageClass}>
          Last
        </span>
      )}
    </nav>
  );
}
