import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ISectionRepository } from '../../../../domain/repositories/section.repository.interface';
import { SectionEntity } from '../../../../domain/entities/section.entity';
import { StudentEntity } from '../../../../domain/entities/student.entity';

@Injectable()
export class PrismaSectionRepository implements ISectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): SectionEntity | null {
    if (!dbRecord) return null;
    const { students, ...sectionData } = dbRecord;
    const entity = new SectionEntity(sectionData);
    if (students) {
      entity.students = students.map((s: any) => new StudentEntity(s));
    }
    return entity;
  }

  async findById(id: string): Promise<SectionEntity | null> {
    const record = await this.prisma.section.findUnique({
      where: { id },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(record);
  }

  async findAll(): Promise<SectionEntity[]> {
    const records = await this.prisma.section.findMany({
      include: {
        students: true,
      },
      orderBy: { grade: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async create(section: Partial<SectionEntity>): Promise<SectionEntity> {
    const record = await this.prisma.section.create({
      data: {
        name: section.name!,
        grade: section.grade!,
        level: section.level!,
        capacity: section.capacity!,
        status: section.status ?? 'OPEN',
      },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(record)!;
  }

  async update(
    id: string,
    section: Partial<SectionEntity>,
  ): Promise<SectionEntity> {
    const updated = await this.prisma.section.update({
      where: { id },
      data: {
        name: section.name,
        grade: section.grade,
        level: section.level,
        capacity: section.capacity,
        status: section.status,
      },
      include: {
        students: true,
      },
    });
    return this.mapToEntity(updated)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.section.delete({
      where: { id },
    });
  }
}

