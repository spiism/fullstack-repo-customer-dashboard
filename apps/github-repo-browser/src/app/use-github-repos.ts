"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GitHubRepo = {
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

export const PAGE_SIZE = 10;
export const MAX_PAGE = 3;

type RequestStatus = "idle" | "loading" | "success" | "error";

type PageState = {
  status: RequestStatus;
  repos: GitHubRepo[];
  error: string | null;
};

const GITHUB_REPOS_URL = "https://api.github.com/orgs/github/repos";
const EMPTY_PAGE_STATE: PageState = {
  status: "idle",
  repos: [],
  error: null,
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to load repositories.";
}

async function fetchGithubRepos(page: number, signal: AbortSignal) {
  const params = new URLSearchParams({
    sort: "name",
    per_page: String(PAGE_SIZE),
    page: String(page),
  });

  const response = await fetch(`${GITHUB_REPOS_URL}?${params}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`GitHub responded with ${response.status}.`);
  }

  return (await response.json()) as GitHubRepo[];
}

export function useGithubRepos(page: number) {
  const [pages, setPages] = useState<Record<number, PageState>>({});
  const pagesRef = useRef(pages);
  const controllersRef = useRef<Record<number, AbortController>>({});

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const loadPage = useCallback((targetPage: number, force = false) => {
    const cachedPage = pagesRef.current[targetPage];
    const existingController = controllersRef.current[targetPage];

    if (!force && (cachedPage?.status === "success" || existingController)) {
      return;
    }

    existingController?.abort();

    const controller = new AbortController();
    controllersRef.current[targetPage] = controller;

    setPages((current) => ({
      ...current,
      [targetPage]: {
        status: "loading",
        repos: current[targetPage]?.repos ?? [],
        error: null,
      },
    }));

    void fetchGithubRepos(targetPage, controller.signal)
      .then((repos) => {
        setPages((current) => ({
          ...current,
          [targetPage]: {
            status: "success",
            repos,
            error: null,
          },
        }));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setPages((current) => ({
          ...current,
          [targetPage]: {
            status: "error",
            repos: current[targetPage]?.repos ?? [],
            error: getErrorMessage(error),
          },
        }));
      })
      .finally(() => {
        if (controllersRef.current[targetPage] === controller) {
          delete controllersRef.current[targetPage];
        }
      });
  }, []);

  useEffect(() => {
    loadPage(page);
  }, [loadPage, page]);

  useEffect(() => {
    return () => {
      Object.values(controllersRef.current).forEach((controller) => {
        controller.abort();
      });
      controllersRef.current = {};
    };
  }, []);

  const retry = useCallback(() => {
    loadPage(page, true);
  }, [loadPage, page]);

  return {
    ...(pages[page] ?? EMPTY_PAGE_STATE),
    retry,
  };
}
