import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { auth } from '../../infrastructure/config/better-auth/better-auth.config';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    const betterAuthUser = await auth.api.signUpEmail({
      body: {
        email: data.email!,
        password: data.password!,
        name: data.name || '',
        role: data.role,
      },
    });

    if (!betterAuthUser || !betterAuthUser.user) {
      throw new Error('Error al crear el usuario en Better Auth');
    }

    return new UserEntity(betterAuthUser.user as UserEntity);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.update(id, data);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
