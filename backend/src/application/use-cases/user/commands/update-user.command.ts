import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserNotFoundException } from '../../../../domain/exceptions/user/user-not-found.exception';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly data: Partial<UserEntity>,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    const existing = await this.userRepository.findById(command.id);
    if (!existing) {
      throw new UserNotFoundException(command.id);
    }
    return this.userRepository.update(command.id, command.data);
  }
}
