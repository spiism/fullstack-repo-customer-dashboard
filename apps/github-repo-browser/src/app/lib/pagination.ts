export const PAGE_SIZE = 10;

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
