import { redirect } from "next/navigation";
import { RepositoryBrowser } from "./components/repository-browser";
import { getGithubReposPage } from "./lib/github-repos";
import { getPageHref, parsePageParam } from "./lib/pagination";

type HomeProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parsePageParam((await searchParams).page);
  const result = await getGithubReposPage(currentPage);

  if (result.totalPages && currentPage > result.totalPages) {
    redirect(getPageHref(result.totalPages));
  }

  return <RepositoryBrowser currentPage={currentPage} result={result} />;
}
