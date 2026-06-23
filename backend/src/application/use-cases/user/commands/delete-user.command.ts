import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../../../../domain/exceptions/user.exceptions';

export class DeleteUserCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    // 1. Buscar al usuario existente por su ID
    const existing = await this.userRepository.findById(command.id);
    if (!existing) {
      // Si el usuario no existe, lanzar la excepción UserNotFoundException
      throw new UserNotFoundException(command.id);
    }

    // 2. Eliminar al usuario del repositorio
    return this.userRepository.delete(command.id);
  }
}
