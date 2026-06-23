import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';

export class GetUserByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserEntity | null> {
    // 1. Consultar en el repositorio si existe un usuario con el ID único especificado
    // Retorna null si el usuario no se encuentra.
    return this.userRepository.findById(query.id);
  }
}
