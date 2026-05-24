export const PAGE_SIZE = 10;

export type PageItem = number | "ellipsis-start" | "ellipsis-end";

export function parsePageParam(page: string | string[] | undefined) {
  const pageValue = Array.isArray(page) ? page[0] : page;
  const parsedPage = Number(pageValue);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

export function getPageHref(page: number) {
  return page <= 1 ? "/" : `/?page=${page}`;
}

export function getPaginationItems(currentPage: number, totalPages: number) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const visiblePages = new Set<number>([1, safeTotalPages]);
  const windowStart = Math.max(1, safeCurrentPage - 2);
  const windowEnd = Math.min(safeTotalPages, safeCurrentPage + 2);

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
