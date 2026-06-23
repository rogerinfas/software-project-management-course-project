import {
  GetEnrollmentDocumentsQuery,
  GetEnrollmentDocumentsQueryHandler,
} from './get-enrollment-documents.query';

describe('GetEnrollmentDocumentsQueryHandler', () => {
  let handler: GetEnrollmentDocumentsQueryHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findManyPaginated: jest.fn(),
    };
    handler = new GetEnrollmentDocumentsQueryHandler(repository);
  });

  it('should return paginated enrollment documents', async () => {
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

    const query = new GetEnrollmentDocumentsQuery(1, 10, 'search');
    const result = await handler.execute(query);

    expect(result).toBe(paginatedResult);
    expect(repository.findManyPaginated).toHaveBeenCalledWith(1, 10, 'search');
  });
});
