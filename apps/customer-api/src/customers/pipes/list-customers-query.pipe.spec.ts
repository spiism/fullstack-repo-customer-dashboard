import { BadRequestException } from '@nestjs/common';
import { ListCustomersQueryPipe } from './list-customers-query.pipe';

describe('ListCustomersQueryPipe', () => {
  const pipe = new ListCustomersQueryPipe();

  it('converts pagination params to numbers and trims search', () => {
    expect(
      pipe.transform({
        page: '2',
        limit: '25',
        search: '  laura  ',
      }),
    ).toEqual({
      page: 2,
      limit: 25,
      search: 'laura',
    });
  });

  it('uses defaults for missing pagination params', () => {
    expect(pipe.transform(undefined)).toEqual({
      page: 1,
      limit: 10,
    });
  });

  it('rejects invalid pagination params', () => {
    expect(() => pipe.transform({ page: 'abc' })).toThrow(BadRequestException);
    expect(() => pipe.transform({ limit: '101' })).toThrow(BadRequestException);
  });
});
