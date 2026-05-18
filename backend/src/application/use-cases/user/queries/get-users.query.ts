import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { PaginatedResult } from '../../../../config/interfaces/pagination.interface';

export class GetUsersQuery implements IQuery {
  constructor(
    public readonly page?: number,
    public readonly size?: number,
  ) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery, UserEntity[] | PaginatedResult<UserEntity>> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<UserEntity[] | PaginatedResult<UserEntity>> {
    const { page, size } = query;
    if (page !== undefined && size !== undefined) {
      return this.userRepository.findManyPaginated(page, size);
    }
    return this.userRepository.findAll();
  }
}
