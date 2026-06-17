import { GetUserByIdQuery, GetUserByIdQueryHandler } from './get-user-by-id.query';
import { UserEntity } from '../../../../domain/entities/user.entity';

describe('GetUserByIdQueryHandler', () => {
  let handler: GetUserByIdQueryHandler;
  let userRepository: any;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    };
    handler = new GetUserByIdQueryHandler(userRepository);
  });

  it('should return null if user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);
    const query = new GetUserByIdQuery('non-existent-id');
    const result = await handler.execute(query);

    expect(result).toBeNull();
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should return user if found', async () => {
    const user = new UserEntity({ id: 'user-1', email: 'test@example.com' });
    userRepository.findById.mockResolvedValue(user);

    const query = new GetUserByIdQuery('user-1');
    const result = await handler.execute(query);

    expect(result).toBe(user);
    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
  });
});
