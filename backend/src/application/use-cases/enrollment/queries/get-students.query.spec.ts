import {
  GetStudentsQuery,
  GetStudentsQueryHandler,
} from './get-students.query';

describe('GetStudentsQueryHandler', () => {
  let handler: GetStudentsQueryHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findManyPaginated: jest.fn(),
    };
    handler = new GetStudentsQueryHandler(repository);
  });

  it('should return paginated students', async () => {
    const paginatedResult = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    };
    repository.findManyPaginated.mockResolvedValue(paginatedResult);

    const query = new GetStudentsQuery(1, 10, 'search');
    const result = await handler.execute(query);

    expect(result).toBe(paginatedResult);
    expect(repository.findManyPaginated).toHaveBeenCalledWith(1, 10, 'search');
  });
});
