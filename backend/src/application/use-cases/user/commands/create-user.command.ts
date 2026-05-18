import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { auth } from '../../../../infrastructure/config/better-auth/better-auth.config';
import { EmailAlreadyExistsException } from '../../../../domain/exceptions/user/email-already-exists.exception';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly user: UserEntity,
    public readonly password?: string,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const { user, password } = command;

    // Check domain rule: email uniqueness
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(user.email);
    }

    // Better Auth handles user creation and password hashing
    const betterAuthUser = await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: password || 'TempPass123!', // Require a password for credential auth
        name: user.name || '',
        role: user.role,
        image: user.image || '',
      },
    });

    if (!betterAuthUser || !betterAuthUser.user) {
      throw new Error('Error al crear el usuario en Better Auth');
    }

    // Return a domain entity
    return new UserEntity(betterAuthUser.user as Partial<UserEntity>);
  }
}
