import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { IStudentRepository } from '../../../../domain/repositories/student.repository.interface';
import { StudentEntity } from '../../../../domain/entities/student.entity';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { SectionEntity } from '../../../../domain/entities/section.entity';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

@Injectable()
export class PrismaStudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): StudentEntity | null {
    if (!dbRecord) return null;
    const { guardian, section, enrollments, ...studentData } = dbRecord;
    const entity = new StudentEntity(studentData);
    if (guardian) {
      entity.guardian = new GuardianEntity(guardian);
    }
    if (section) {
      entity.section = new SectionEntity(section);
    }
    if (enrollments) {
      entity.enrollments = enrollments.map((e: any) => new EnrollmentEntity(e));
    }
    return entity;
  }

  async create(student: Partial<StudentEntity>): Promise<StudentEntity> {
    const created = await this.prisma.student.create({
      data: {
        code: student.code,
        firstName: student.firstName!,
        lastName: student.lastName!,
        dni: student.dni!,
        level: student.level!,
        grade: student.grade!,
        sectionId: student.sectionId,
        guardianId: student.guardianId!,
      },
      include: {
        guardian: true,
        section: true,
        enrollments: true,
      },
    });
    return this.mapToEntity(created)!;
  }

  async findById(id: string): Promise<StudentEntity | null> {
    const record = await this.prisma.student.findUnique({
      where: { id },
      include: {
        guardian: true,
        section: true,
        enrollments: true,
      },
    });
    return this.mapToEntity(record);
  }

  async findByDni(dni: string): Promise<StudentEntity | null> {
    const record = await this.prisma.student.findUnique({
      where: { dni },
      include: {
        guardian: true,
        section: true,
        enrollments: true,
      },
    });
    return this.mapToEntity(record);
  }

  async update(
    id: string,
    student: Partial<StudentEntity>,
  ): Promise<StudentEntity> {
    const updated = await this.prisma.student.update({
      where: { id },
      data: {
        code: student.code,
        firstName: student.firstName,
        lastName: student.lastName,
        dni: student.dni,
        level: student.level,
        grade: student.grade,
        sectionId: student.sectionId,
        guardianId: student.guardianId,
      },
      include: {
        guardian: true,
        section: true,
        enrollments: true,
      },
    });
    return this.mapToEntity(updated)!;
  }

  async findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<StudentEntity>> {
    const where: Prisma.StudentWhereInput = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { dni: { contains: search } },
          ],
        }
      : {};

    const [total, records] = await this.prisma.$transaction([
      this.prisma.student.count({ where }),
      this.prisma.student.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { lastName: 'asc' },
        include: {
          guardian: true,
          section: true,
          enrollments: true,
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

  async findAll(): Promise<StudentEntity[]> {
    const records = await this.prisma.student.findMany({
      include: {
        guardian: true,
        section: true,
        enrollments: true,
      },
      orderBy: { lastName: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
