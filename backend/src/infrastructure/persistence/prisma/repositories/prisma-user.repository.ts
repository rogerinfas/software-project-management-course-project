import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Role, User as PrismaUser } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        email: user.email!,
        password: user.password || 'temporary_password',
        name: user.name,
        role: (user.role as Role) || Role.ADMIN,
      },
    });
    return new UserEntity(created);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u: PrismaUser) => new UserEntity(u));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? new UserEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? new UserEntity(user) : null;
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role as Role,
      },
    });
    return new UserEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
