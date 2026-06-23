import {
  UpdateUserCommand,
  UpdateUserCommandHandler,
} from './update-user.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserNotFoundException } from '../../../../domain/exceptions/user.exceptions';

describe('UpdateUserCommandHandler', () => {
  let handler: UpdateUserCommandHandler;
  let userRepository: any;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    handler = new UpdateUserCommandHandler(userRepository);
  });

  it('should throw UserNotFoundException if user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);
    const command = new UpdateUserCommand('non-existent-id', {
      name: 'New Name',
    });

    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should update and return user if found', async () => {
    const user = new UserEntity({ id: 'user-1', name: 'Old Name' });
    const updatedUser = new UserEntity({ id: 'user-1', name: 'New Name' });
    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockResolvedValue(updatedUser);

    const command = new UpdateUserCommand('user-1', { name: 'New Name' });
    const result = await handler.execute(command);

    expect(result).toBe(updatedUser);
    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
    expect(userRepository.update).toHaveBeenCalledWith('user-1', {
      name: 'New Name',
    });
  });
});
