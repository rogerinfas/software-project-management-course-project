import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseErrorResponse } from '../../../config/interfaces/base-error-response';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from './dto';
import { CreateUserCommand } from '../../../application/use-cases/user/commands/create-user.command';
import { UpdateUserCommand } from '../../../application/use-cases/user/commands/update-user.command';
import { DeleteUserCommand } from '../../../application/use-cases/user/commands/delete-user.command';
import { GetUsersQuery } from '../../../application/use-cases/user/queries/get-users.query';
import { GetUserByIdQuery } from '../../../application/use-cases/user/queries/get-user-by-id.query';
import { UserEntity } from '../../../domain/entities/user.entity';

@ApiTags('Gestión de Usuarios')
@Controller('users')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'No autenticado',
  type: BaseErrorResponse,
})
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    type: UserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    type: BaseErrorResponse,
  })
  async create(@Body() createDto: CreateUserRequest): Promise<UserResponse> {
    const { password, ...userData } = createDto;
    const entity = new UserEntity(userData as any);
    const result = await this.commandBus.execute(
      new CreateUserCommand(entity, password),
    );
    return result.toDto() as UserResponse;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UserResponse],
  })
  async findAll(): Promise<UserResponse[]> {
    const results: UserEntity[] = await this.queryBus.execute(
      new GetUsersQuery(),
    );
    return results.map((r) => r.toDto());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario obtenido exitosamente',
    type: UserResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    type: BaseErrorResponse,
  })
  async findOne(@Param('id') id: string): Promise<UserResponse | null> {
    const result: UserEntity | null = await this.queryBus.execute(
      new GetUserByIdQuery(id),
    );
    return result ? (result.toDto() as UserResponse) : null;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
    type: UserResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserRequest,
  ): Promise<UserResponse> {
    const result: UserEntity = await this.commandBus.execute(
      new UpdateUserCommand(id, updateDto),
    );
    return result.toDto();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado exitosamente',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
