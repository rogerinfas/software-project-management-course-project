import { PaginatedResult } from '../../config/interfaces/pagination.interface';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findManyPaginated(
    page: number,
    size: number,
  ): Promise<PaginatedResult<UserEntity>>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
