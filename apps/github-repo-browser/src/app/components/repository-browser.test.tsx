import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { GitHubReposResult } from "../lib/github-repos";
import { RepositoryBrowser } from "./repository-browser";

const successResult: GitHubReposResult = {
  status: "success",
  hasNextPage: true,
  totalPages: 52,
  repos: [
    {
      id: 1,
      name: "actions",
      full_name: "github/actions",
      html_url: "https://github.com/github/actions",
      description: "GitHub Actions",
      private: false,
      fork: false,
      language: "TypeScript",
      stargazers_count: 120,
      forks_count: 35,
      updated_at: "2026-05-02T00:00:00Z",
    },
  ],
};

describe("RepositoryBrowser", () => {
  it("renders repository data with URL-based pagination links", () => {
    render(<RepositoryBrowser currentPage={2} result={successResult} />);

    expect(
      screen.getByRole("heading", { name: "Repositories" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "actions" })).toHaveAttribute(
      "href",
      "https://github.com/github/actions",
    );
    expect(screen.getByText("120 stars")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/?page=3",
    );
  });

  it("renders accessible error state with retry link", () => {
    render(
      <RepositoryBrowser
        currentPage={4}
        result={{
          status: "error",
          error: "GitHub API rate limit reached. Try again later.",
          hasNextPage: false,
          totalPages: null,
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "GitHub API rate limit reached",
    );
    expect(screen.getByRole("link", { name: "Retry" })).toHaveAttribute(
      "href",
      "/?page=4",
    );
  });
});
