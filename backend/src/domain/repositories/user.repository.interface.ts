import { UserEntity } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract create(user: Partial<UserEntity>): Promise<UserEntity>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract update(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
}
