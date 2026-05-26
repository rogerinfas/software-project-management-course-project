import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IStaffProfileRepository } from '../../../../domain/repositories/staff-profile.repository.interface';
import { StaffProfileEntity } from '../../../../domain/entities/staff-profile.entity';

@Injectable()
export class PrismaStaffProfileRepository implements IStaffProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): StaffProfileEntity | null {
    if (!dbRecord) return null;
    return new StaffProfileEntity(dbRecord);
  }

  async create(staff: Partial<StaffProfileEntity>): Promise<StaffProfileEntity> {
    const record = await this.prisma.staffProfile.create({
      data: {
        userId: staff.userId!,
        specialty: staff.specialty!,
        cvUrl: staff.cvUrl || null,
        entryTime: staff.entryTime || '08:00',
        exitTime: staff.exitTime || '16:00',
        gracePeriod: staff.gracePeriod !== undefined ? staff.gracePeriod : 5,
      },
      include: {
        user: true,
      },
    });
    return this.mapToEntity(record)!;
  }

  async findById(id: string): Promise<StaffProfileEntity | null> {
    const record = await this.prisma.staffProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    return this.mapToEntity(record);
  }

  async findByUserId(userId: string): Promise<StaffProfileEntity | null> {
    const record = await this.prisma.staffProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
    return this.mapToEntity(record);
  }

  async update(id: string, staff: Partial<StaffProfileEntity>): Promise<StaffProfileEntity> {
    const record = await this.prisma.staffProfile.update({
      where: { id },
      data: {
        specialty: staff.specialty,
        cvUrl: staff.cvUrl,
        entryTime: staff.entryTime,
        exitTime: staff.exitTime,
        gracePeriod: staff.gracePeriod,
      },
      include: {
        user: true,
      },
    });
    return this.mapToEntity(record)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.staffProfile.delete({
      where: { id },
    });
  }

  async findAll(): Promise<StaffProfileEntity[]> {
    const records = await this.prisma.staffProfile.findMany({
      include: {
        user: true,
      },
      orderBy: { id: 'asc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
