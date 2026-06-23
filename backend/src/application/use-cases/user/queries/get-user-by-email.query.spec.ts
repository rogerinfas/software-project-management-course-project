import {
  GetUserByEmailQuery,
  GetUserByEmailQueryHandler,
} from './get-user-by-email.query';
import { UserEntity } from '../../../../domain/entities/user.entity';

describe('GetUserByEmailQueryHandler', () => {
  let handler: GetUserByEmailQueryHandler;
  let userRepository: any;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
    };
    handler = new GetUserByEmailQueryHandler(userRepository);
  });

  it('should return null if user is not found by email', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const query = new GetUserByEmailQuery('non-existent@example.com');
    const result = await handler.execute(query);

    expect(result).toBeNull();
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      'non-existent@example.com',
    );
  });

  it('should return user if found by email', async () => {
    const user = new UserEntity({ id: 'user-1', email: 'test@example.com' });
    userRepository.findByEmail.mockResolvedValue(user);

    const query = new GetUserByEmailQuery('test@example.com');
    const result = await handler.execute(query);

    expect(result).toBe(user);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
