import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { StudentEntity } from '../../../../domain/entities/student.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

@Injectable()
export class PrismaGuardianRepository implements IGuardianRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): GuardianEntity | null {
    if (!dbRecord) return null;
    const { students, ...guardianData } = dbRecord;
    const entity = new GuardianEntity(guardianData);
    if (students) {
      entity.students = students.map((s: any) => new StudentEntity(s));
    }
    return entity;
  }

  async create(guardian: Partial<GuardianEntity>): Promise<GuardianEntity> {
    const created = await this.prisma.guardian.create({
      data: {
        dni: guardian.dni!,
        name: guardian.name!,
        phone: guardian.phone!,
        email: guardian.email,
        occupation: guardian.occupation,
      },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(created)!;
  }

  async findById(id: string): Promise<GuardianEntity | null> {
    const record = await this.prisma.guardian.findUnique({
      where: { id },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(record);
  }

  async findByDni(dni: string): Promise<GuardianEntity | null> {
    const record = await this.prisma.guardian.findUnique({
      where: { dni },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(record);
  }

  async update(
    id: string,
    guardian: Partial<GuardianEntity>,
  ): Promise<GuardianEntity> {
    const updated = await this.prisma.guardian.update({
      where: { id },
      data: {
        dni: guardian.dni,
        name: guardian.name,
        phone: guardian.phone,
        email: guardian.email,
        occupation: guardian.occupation,
      },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(updated)!;
  }

  async delete(id: string): Promise<GuardianEntity> {
    const deleted = await this.prisma.guardian.delete({
      where: { id },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(deleted)!;
  }

  async findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<GuardianEntity>> {
    const where: Prisma.GuardianWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { dni: { contains: search } },
          ],
        }
      : {};

    const [total, records] = await this.prisma.$transaction([
      this.prisma.guardian.count({ where }),
      this.prisma.guardian.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { name: 'asc' },
        include: {
          students: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: records.map((r) => this.mapToEntity(r)!),
      meta: {
        total,
        page,
        size,
        totalPages,
        hasNext: page < totalPages,
      },
    };
  }

  async findAll(): Promise<GuardianEntity[]> {
    const records = await this.prisma.guardian.findMany({
      include: {
        students: true,
      },
      orderBy: { name: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
