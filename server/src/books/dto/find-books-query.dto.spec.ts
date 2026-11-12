import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindBooksQueryDto } from './find-books-query.dto';

describe('FindBooksQueryDto', () => {
  const validateQuery = (query: { page?: string; limit?: string }) =>
    validate(plainToInstance(FindBooksQueryDto, query));

  it('applies default pagination values', async () => {
    const query = plainToInstance(FindBooksQueryDto, {});

    expect(query).toMatchObject({ page: 1, limit: 10 });
    expect(await validate(query)).toHaveLength(0);
  });

  it('accepts a limit of 100', async () => {
    expect(await validateQuery({ page: '2', limit: '100' })).toHaveLength(0);
  });

  it.each([
    { page: '0' },
    { page: '1.5' },
    { page: 'abc' },
    { limit: '0' },
    { limit: '101' },
  ])('rejects %o', async (query) => {
    expect((await validateQuery(query)).length).toBeGreaterThan(0);
  });
});
