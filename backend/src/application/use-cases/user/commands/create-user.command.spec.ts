import {
  CreateUserCommand,
  CreateUserCommandHandler,
} from './create-user.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { EmailAlreadyExistsException } from '../../../../domain/exceptions/user.exceptions';
import { Role } from '@prisma/client';

const mockSignUpEmail = jest.fn();

jest.mock(
  '../../../../infrastructure/config/better-auth/better-auth.config',
  () => ({
    auth: {
      api: {
        signUpEmail: (...args: any[]) => mockSignUpEmail(...args),
      },
    },
  }),
);

describe('CreateUserCommandHandler', () => {
  let handler: CreateUserCommandHandler;
  let userRepository: any;

  beforeEach(() => {
    mockSignUpEmail.mockReset();
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    handler = new CreateUserCommandHandler(userRepository);
  });

  it('should throw EmailAlreadyExistsException if email already exists', async () => {
    const user = new UserEntity({
      email: 'test@example.com',
      name: 'Test User',
      role: Role.ADMIN,
    });
    userRepository.findByEmail.mockResolvedValue(user);

    const command = new CreateUserCommand(user, 'password123');

    await expect(handler.execute(command)).rejects.toThrow(
      EmailAlreadyExistsException,
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw error if better auth returns invalid response', async () => {
    const user = new UserEntity({
      email: 'test@example.com',
      name: 'Test User',
      role: Role.ADMIN,
    });
    userRepository.findByEmail.mockResolvedValue(null);
    mockSignUpEmail.mockResolvedValue(null);

    const command = new CreateUserCommand(user, 'password123');

    await expect(handler.execute(command)).rejects.toThrow(
      'Error al crear el usuario en Better Auth',
    );
  });

  it('should successfully create user and return user entity', async () => {
    const user = new UserEntity({
      email: 'test@example.com',
      name: 'Test User',
      role: Role.ADMIN,
    });
    userRepository.findByEmail.mockResolvedValue(null);
    mockSignUpEmail.mockResolvedValue({
      user: {
        id: 'new-id',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.ADMIN,
      },
    });

    const command = new CreateUserCommand(user, 'password123');
    const result = await handler.execute(command);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBe('new-id');
    expect(mockSignUpEmail).toHaveBeenCalledWith({
      body: {
        email: user.email,
        password: 'password123',
        name: user.name,
        role: user.role,
        image: '',
      },
    });
  });
});
