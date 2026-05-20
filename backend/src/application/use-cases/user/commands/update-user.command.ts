import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserNotFoundException } from '../../../../domain/exceptions/user.exceptions';

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
    // 1. Buscar al usuario existente por su ID
    const existing = await this.userRepository.findById(command.id);
    if (!existing) {
      // Si el usuario no existe, lanzar la excepción específica UserNotFoundException
      throw new UserNotFoundException(command.id);
    }

    // 2. Actualizar y retornar la entidad de usuario modificada en el repositorio
    return this.userRepository.update(command.id, command.data);
  }
}
