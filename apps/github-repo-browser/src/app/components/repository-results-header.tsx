"use client";

import { useEffect, useRef } from "react";

type RepositoryResultsHeaderProps = {
  currentPage: number;
  repoCount: number;
  rangeLabel: string;
  totalPages: number | null;
};

const FOCUS_FLAG = "github-repo-browser-page-navigation";

export function markRepositoryNavigation() {
  window.sessionStorage.setItem(FOCUS_FLAG, "true");
}

export function RepositoryResultsHeader({
  currentPage,
  repoCount,
  rangeLabel,
  totalPages,
}: RepositoryResultsHeaderProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(FOCUS_FLAG) !== "true") {
      return;
    }

    window.sessionStorage.removeItem(FOCUS_FLAG);
    headingRef.current?.focus();
  }, [currentPage]);

  const pageLabel = totalPages
    ? `Page ${currentPage} of ${totalPages}.`
    : `Page ${currentPage}.`;
  const countLabel =
    repoCount > 0
      ? `Showing repositories ${rangeLabel}.`
      : "No repositories returned for this page.";

  return (
    <div className="min-w-0">
      <h2
        className="text-xl font-semibold text-github-fg focus:outline-none"
        id="repository-list-heading"
        ref={headingRef}
        tabIndex={-1}
      >
        Repositories
      </h2>
      <p className="mt-1 text-sm text-github-muted" aria-live="polite">
        {countLabel} {pageLabel}
      </p>
    </div>
  );
}
