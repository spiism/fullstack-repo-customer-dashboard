import { afterEach, describe, expect, it, vi } from "vitest";
import { getGithubReposPage, parseGitHubLinkHeader } from "./github-repos";
import { getPageHref, parsePageParam } from "./pagination";

const linkHeader =
  '<https://api.github.com/orgs/github/repos?sort=name&per_page=10&page=2>; rel="next", ' +
  '<https://api.github.com/orgs/github/repos?sort=name&per_page=10&page=52>; rel="last"';

describe("github repo helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("normalizes page params and page hrefs", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam(["3", "4"])).toBe(3);
    expect(getPageHref(1)).toBe("/");
    expect(getPageHref(4)).toBe("/?page=4");
  });

  it("reads pagination links from GitHub link headers", () => {
    expect(parseGitHubLinkHeader(linkHeader)).toEqual({
      next: 2,
      last: 52,
    });
  });

  it("fetches a repository page and exposes pagination metadata", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 1,
            name: "actions",
            full_name: "github/actions",
            html_url: "https://github.com/github/actions",
            description: "GitHub Actions",
            private: false,
            fork: false,
            language: "TypeScript",
            stargazers_count: 100,
            forks_count: 25,
            updated_at: "2026-05-02T00:00:00Z",
          },
        ]),
        {
          headers: {
            link: linkHeader,
          },
          status: 200,
        },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(getGithubReposPage(1)).resolves.toMatchObject({
      status: "success",
      hasNextPage: true,
      totalPages: 52,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/orgs/github/repos?sort=name&per_page=10&page=1",
      expect.objectContaining({
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: {
          revalidate: 60,
        },
      }),
    );
  });

  it("returns a rate-limit-aware error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          headers: {
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": "1770000000",
          },
          status: 403,
        }),
      ),
    );

    await expect(getGithubReposPage(1)).resolves.toMatchObject({
      status: "error",
      error: expect.stringContaining("GitHub API rate limit reached"),
    });
  });
});
