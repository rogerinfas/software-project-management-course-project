import { GetGuardiansQuery, GetGuardiansQueryHandler } from './get-guardians.query';

describe('GetGuardiansQueryHandler', () => {
  let handler: GetGuardiansQueryHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findManyPaginated: jest.fn(),
    };
    handler = new GetGuardiansQueryHandler(repository);
  });

  it('should return paginated guardians', async () => {
    const paginatedResult = { data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0, hasNext: false, hasPrevious: false } };
    repository.findManyPaginated.mockResolvedValue(paginatedResult);

    const query = new GetGuardiansQuery(1, 10, 'search');
    const result = await handler.execute(query);

    expect(result).toBe(paginatedResult);
    expect(repository.findManyPaginated).toHaveBeenCalledWith(1, 10, 'search');
  });
});
