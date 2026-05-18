import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../../../../domain/exceptions/user.exceptions';

export class DeleteUserCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const existing = await this.userRepository.findById(command.id);
    if (!existing) {
      throw new UserNotFoundException(command.id);
    }
    return this.userRepository.delete(command.id);
  }
}
