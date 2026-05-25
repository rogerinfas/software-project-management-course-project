import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IScheduleRepository } from '../../../../domain/repositories/schedule.repository.interface';
import { ScheduleEntity } from '../../../../domain/entities/schedule.entity';

@Injectable()
export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): ScheduleEntity | null {
    if (!dbRecord) return null;
    return new ScheduleEntity(dbRecord);
  }

  async create(schedule: Partial<ScheduleEntity>): Promise<ScheduleEntity> {
    const record = await this.prisma.schedule.create({
      data: {
        sectionId: schedule.sectionId!,
        courseId: schedule.courseId!,
        staffId: schedule.staffId!,
        day: schedule.day!,
        startTime: schedule.startTime!,
        endTime: schedule.endTime!,
      },
    });
    return this.mapToEntity(record)!;
  }

  async findById(id: string): Promise<ScheduleEntity | null> {
    const record = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        section: true,
        course: true,
      },
    });
    return this.mapToEntity(record);
  }

  async update(id: string, schedule: Partial<ScheduleEntity>): Promise<ScheduleEntity> {
    const record = await this.prisma.schedule.update({
      where: { id },
      data: {
        sectionId: schedule.sectionId,
        courseId: schedule.courseId,
        staffId: schedule.staffId,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      },
    });
    return this.mapToEntity(record)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.schedule.delete({
      where: { id },
    });
  }

  async findBySection(sectionId: string): Promise<ScheduleEntity[]> {
    const records = await this.prisma.schedule.findMany({
      where: { sectionId },
      include: {
        section: true,
        course: true,
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' },
      ],
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async findByTeacher(staffId: string): Promise<ScheduleEntity[]> {
    const records = await this.prisma.schedule.findMany({
      where: { staffId },
      include: {
        section: true,
        course: true,
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' },
      ],
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async checkConflicts(
    day: number,
    startTime: string,
    endTime: string,
    sectionId: string,
    staffId: string,
    excludeId?: string,
  ): Promise<ScheduleEntity[]> {
    const conflicts = await this.prisma.schedule.findMany({
      where: {
        day,
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          { sectionId },
          { staffId },
        ],
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
      include: {
        section: true,
        course: true,
      },
    });
    return conflicts.map((r) => this.mapToEntity(r)!);
  }

  async findAll(): Promise<ScheduleEntity[]> {
    const records = await this.prisma.schedule.findMany({
      include: {
        section: true,
        course: true,
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' },
      ],
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
