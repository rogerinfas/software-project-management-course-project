import { GetProspectsPaginatedQuery, GetProspectsPaginatedQueryHandler } from './get-prospects-paginated.query';

describe('GetProspectsPaginatedQueryHandler', () => {
  let handler: GetProspectsPaginatedQueryHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findManyPaginated: jest.fn(),
    };
    handler = new GetProspectsPaginatedQueryHandler(repository);
  });

  it('should return paginated prospects', async () => {
    const paginatedResult = { data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0, hasNext: false, hasPrevious: false } };
    repository.findManyPaginated.mockResolvedValue(paginatedResult);

    const query = new GetProspectsPaginatedQuery(1, 10, 'search-term');
    const result = await handler.execute(query);

    expect(result).toBe(paginatedResult);
    expect(repository.findManyPaginated).toHaveBeenCalledWith(1, 10, 'search-term');
  });
});
