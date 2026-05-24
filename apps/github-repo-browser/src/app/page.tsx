import { RepositoryBrowser } from "./components/repository-browser";
import { getGithubReposPage } from "./lib/github-repos";
import { parsePageParam } from "./lib/pagination";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parsePageParam((await searchParams).page);
  const result = await getGithubReposPage(currentPage);

  return <RepositoryBrowser currentPage={currentPage} result={result} />;
}
