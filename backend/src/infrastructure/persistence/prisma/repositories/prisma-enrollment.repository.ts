import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { IEnrollmentRepository } from '../../../../domain/repositories/enrollment.repository.interface';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';
import { StudentEntity } from '../../../../domain/entities/student.entity';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { SectionEntity } from '../../../../domain/entities/section.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

@Injectable()
export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): EnrollmentEntity | null {
    if (!dbRecord) return null;
    const { student, ...enrollmentData } = dbRecord;
    const entity = new EnrollmentEntity(enrollmentData);
    if (student) {
      const { guardian, section, ...studentData } = student;
      const studentEntity = new StudentEntity(studentData);
      if (guardian) {
        studentEntity.guardian = new GuardianEntity(guardian);
      }
      if (section) {
        studentEntity.section = new SectionEntity(section);
      }
      entity.student = studentEntity;
    }
    return entity;
  }

  async create(enrollment: Partial<EnrollmentEntity>): Promise<EnrollmentEntity> {
    const created = await this.prisma.enrollment.create({
      data: {
        studentId: enrollment.studentId!,
        year: enrollment.year!,
        status: enrollment.status!,
        pdfUrl: enrollment.pdfUrl,
      },
      include: {
        student: {
          include: {
            guardian: true,
            section: true,
          },
        },
      },
    });
    return this.mapToEntity(created)!;
  }

  async findById(id: string): Promise<EnrollmentEntity | null> {
    const record = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            guardian: true,
            section: true,
          },
        },
      },
    });
    return this.mapToEntity(record);
  }

  async findByStudentId(studentId: string): Promise<EnrollmentEntity[]> {
    const records = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        student: {
          include: {
            guardian: true,
            section: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<EnrollmentEntity>> {
    const where: Prisma.EnrollmentWhereInput = search
      ? {
          student: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { dni: { contains: search } },
            ],
          },
        }
      : {};

    const [total, records] = await this.prisma.$transaction([
      this.prisma.enrollment.count({ where }),
      this.prisma.enrollment.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { date: 'desc' },
        include: {
          student: {
            include: {
              guardian: true,
              section: true,
            },
          },
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

  async findAll(): Promise<EnrollmentEntity[]> {
    const records = await this.prisma.enrollment.findMany({
      include: {
        student: {
          include: {
            guardian: true,
            section: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
