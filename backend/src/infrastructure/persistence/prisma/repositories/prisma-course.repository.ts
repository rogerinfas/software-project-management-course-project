import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICourseRepository } from '../../../../domain/repositories/course.repository.interface';
import { CourseEntity } from '../../../../domain/entities/course.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): CourseEntity | null {
    if (!dbRecord) return null;
    return new CourseEntity(dbRecord);
  }

  async create(course: Partial<CourseEntity>): Promise<CourseEntity> {
    const record = await this.prisma.course.create({
      data: {
        name: course.name!,
        description: course.description,
      },
    });
    return this.mapToEntity(record)!;
  }

  async findById(id: string): Promise<CourseEntity | null> {
    const record = await this.prisma.course.findUnique({
      where: { id },
    });
    return this.mapToEntity(record);
  }

  async findByName(name: string): Promise<CourseEntity | null> {
    const record = await this.prisma.course.findFirst({
      where: { name },
    });
    return this.mapToEntity(record);
  }

  async update(id: string, course: Partial<CourseEntity>): Promise<CourseEntity> {
    const record = await this.prisma.course.update({
      where: { id },
      data: {
        name: course.name,
        description: course.description,
      },
    });
    return this.mapToEntity(record)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({
      where: { id },
    });
  }

  async findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<CourseEntity>> {
    const skip = (page - 1) * size;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [records, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: size,
        orderBy: { name: 'asc' },
      }),
      this.prisma.course.count({ where }),
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

  async findAll(): Promise<CourseEntity[]> {
    const records = await this.prisma.course.findMany({
      orderBy: { name: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
