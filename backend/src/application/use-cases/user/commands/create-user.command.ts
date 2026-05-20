import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { auth } from '../../../../infrastructure/config/better-auth/better-auth.config';
import { EmailAlreadyExistsException } from '../../../../domain/exceptions/user.exceptions';

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
    // 1. Extraer la entidad de usuario y la contraseña opcional del comando
    const { user, password } = command;

    // 2. Verificar la regla de dominio de unicidad de correo electrónico
    // Si ya existe un usuario con el mismo email, lanzamos la excepción EmailAlreadyExistsException.
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(user.email);
    }

    // 3. Crear el usuario en Better Auth, que maneja la creación y el hashing de la contraseña
    const betterAuthUser = await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: password || 'TempPass123!', // Se requiere contraseña para autenticación por credenciales
        name: user.name || '',
        role: user.role,
        image: user.image || '',
      },
    });

    // 4. Si la respuesta de Better Auth no es válida, se lanza un error de ejecución
    if (!betterAuthUser || !betterAuthUser.user) {
      throw new Error('Error al crear el usuario en Better Auth');
    }

    // 5. Retornar la nueva entidad de usuario de dominio mapeada desde el objeto devuelto por Better Auth
    return new UserEntity(betterAuthUser.user as Partial<UserEntity>);
  }
}
