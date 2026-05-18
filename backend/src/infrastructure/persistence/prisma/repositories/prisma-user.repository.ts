import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Role, User as PrismaUser } from '@prisma/client';
import { PaginatedResult } from '../../../../config/interfaces/pagination.interface';
import {
  paginationStart,
  calcTotalPages,
  hasNextPage,
  hasPreviousPage,
} from '../../../../config/utils/pagination';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    // Better Auth normally handles user creation with password.
    // This is a fallback or for system users without auth accounts.
    const created = await this.prisma.user.create({
      data: {
        email: user.email!,
        name: user.name,
        role: (user.role as Role) || Role.ADMIN,
        emailVerified: user.emailVerified || false,
        image: user.image,
      },
    });
    return new UserEntity(created);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u: PrismaUser) => new UserEntity(u));
  }

  async findManyPaginated(page: number, size: number): Promise<PaginatedResult<UserEntity>> {
    const skip = paginationStart({ page, pageSize: size });
    const take = size;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = calcTotalPages({ total, pageSize: size });

    return {
      data: users.map((u: PrismaUser) => new UserEntity(u)),
      meta: {
        total,
        page,
        pageSize: size,
        totalPages,
        hasNext: hasNextPage({ page, totalPages }),
        hasPrevious: hasPreviousPage({ page }),
      },
    };
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
        name: user.name,
        role: user.role as Role,
        emailVerified: user.emailVerified,
        image: user.image,
        deletedAt: user.deletedAt,
      },
    });
    return new UserEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
