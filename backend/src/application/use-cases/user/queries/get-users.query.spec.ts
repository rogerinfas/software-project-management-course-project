import { GetUsersQuery, GetUsersQueryHandler } from './get-users.query';
import { UserEntity } from '../../../../domain/entities/user.entity';

describe('GetUsersQueryHandler', () => {
  let handler: GetUsersQueryHandler;
  let userRepository: any;

  beforeEach(() => {
    userRepository = {
      findManyPaginated: jest.fn(),
    };
    handler = new GetUsersQueryHandler(userRepository);
  });

  it('should call findManyPaginated with default values when no args are provided', async () => {
    const paginatedResult = { data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0, hasNext: false, hasPrevious: false } };
    userRepository.findManyPaginated.mockResolvedValue(paginatedResult);

    const query = new GetUsersQuery();
    const result = await handler.execute(query);

    expect(result).toBe(paginatedResult);
    expect(userRepository.findManyPaginated).toHaveBeenCalledWith(1, 10);
  });

  it('should call findManyPaginated with custom values when arguments are provided', async () => {
    const paginatedResult = { data: [], meta: { total: 0, page: 2, pageSize: 5, totalPages: 0, hasNext: false, hasPrevious: false } };
    userRepository.findManyPaginated.mockResolvedValue(paginatedResult);

    const query = new GetUsersQuery(2, 5);
    const result = await handler.execute(query);

    expect(result).toBe(paginatedResult);
    expect(userRepository.findManyPaginated).toHaveBeenCalledWith(2, 5);
  });
});
