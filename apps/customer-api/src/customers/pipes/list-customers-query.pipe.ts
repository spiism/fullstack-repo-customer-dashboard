import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ListCustomersQueryDto } from '../dto/list-customers-query.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const MAX_SEARCH_LENGTH = 100;

@Injectable()
export class ListCustomersQueryPipe implements PipeTransform<
  Record<string, unknown> | undefined,
  ListCustomersQueryDto
> {
  transform(value: Record<string, unknown> = {}): ListCustomersQueryDto {
    const page = parseIntegerQuery(value.page, 'page', DEFAULT_PAGE);
    const limit = parseIntegerQuery(value.limit, 'limit', DEFAULT_LIMIT, {
      max: MAX_LIMIT,
    });
    const search = parseSearchQuery(value.search);

    return {
      page,
      limit,
      ...(search ? { search } : {}),
    };
  }
}

function firstQueryValue(value: unknown): unknown {
  return Array.isArray(value) ? (value as readonly unknown[])[0] : value;
}

function parseIntegerQuery(
  value: unknown,
  field: string,
  defaultValue: number,
  options: { max?: number } = {},
) {
  const rawValue = firstQueryValue(value);

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return defaultValue;
  }

  const parsedValue =
    typeof rawValue === 'string' ? Number(rawValue.trim()) : Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new BadRequestException(`${field} must be a positive integer`);
  }

  if (options.max && parsedValue > options.max) {
    throw new BadRequestException(
      `${field} must be less than or equal to ${options.max}`,
    );
  }

  return parsedValue;
}

function parseSearchQuery(value: unknown) {
  const rawValue = firstQueryValue(value);

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return undefined;
  }

  if (typeof rawValue !== 'string') {
    throw new BadRequestException('search must be a string');
  }

  const search = rawValue.trim();

  if (!search) {
    return undefined;
  }

  if (search.length > MAX_SEARCH_LENGTH) {
    throw new BadRequestException(
      `search must be less than or equal to ${MAX_SEARCH_LENGTH} characters`,
    );
  }

  return search;
}
