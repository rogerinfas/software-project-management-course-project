import {
  DeleteUserCommand,
  DeleteUserCommandHandler,
} from './delete-user.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserNotFoundException } from '../../../../domain/exceptions/user.exceptions';

describe('DeleteUserCommandHandler', () => {
  let handler: DeleteUserCommandHandler;
  let userRepository: any;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };
    handler = new DeleteUserCommandHandler(userRepository);
  });

  it('should throw UserNotFoundException if user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);
    const command = new DeleteUserCommand('non-existent-id');

    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should successfully delete user if found', async () => {
    const user = new UserEntity({ id: 'user-1', email: 'test@example.com' });
    userRepository.findById.mockResolvedValue(user);
    userRepository.delete.mockResolvedValue(undefined);

    const command = new DeleteUserCommand('user-1');
    await handler.execute(command);

    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
    expect(userRepository.delete).toHaveBeenCalledWith('user-1');
  });
});
