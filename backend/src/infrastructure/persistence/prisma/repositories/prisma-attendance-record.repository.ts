import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAttendanceRecordRepository } from '../../../../domain/repositories/attendance-record.repository.interface';
import { AttendanceRecordEntity } from '../../../../domain/entities/attendance-record.entity';

@Injectable()
export class PrismaAttendanceRecordRepository implements IAttendanceRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): AttendanceRecordEntity | null {
    if (!dbRecord) return null;
    return new AttendanceRecordEntity(dbRecord);
  }

  async create(record: Partial<AttendanceRecordEntity>): Promise<AttendanceRecordEntity> {
    const dbRecord = await this.prisma.attendanceRecord.create({
      data: {
        staffId: record.staffId!,
        type: record.type!,
        timestamp: record.timestamp || new Date(),
        method: record.method || 'FACIAL',
        delayMinutes: record.delayMinutes !== undefined ? record.delayMinutes : 0,
        fineAmount: record.fineAmount !== undefined ? record.fineAmount : 0.0,
      },
      include: {
        staff: {
          include: {
            user: true,
          },
        },
      },
    });
    return this.mapToEntity(dbRecord)!;
  }

  async findById(id: string): Promise<AttendanceRecordEntity | null> {
    const record = await this.prisma.attendanceRecord.findUnique({
      where: { id },
      include: {
        staff: {
          include: {
            user: true,
          },
        },
      },
    });
    return this.mapToEntity(record);
  }

  async findByStaffId(staffId: string): Promise<AttendanceRecordEntity[]> {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { staffId },
      include: {
        staff: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }

  async update(id: string, record: Partial<AttendanceRecordEntity>): Promise<AttendanceRecordEntity> {
    const dbRecord = await this.prisma.attendanceRecord.update({
      where: { id },
      data: {
        type: record.type,
        timestamp: record.timestamp,
        method: record.method,
        delayMinutes: record.delayMinutes,
        fineAmount: record.fineAmount,
      },
      include: {
        staff: {
          include: {
            user: true,
          },
        },
      },
    });
    return this.mapToEntity(dbRecord)!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.attendanceRecord.delete({
      where: { id },
    });
  }

  async findAll(): Promise<AttendanceRecordEntity[]> {
    const records = await this.prisma.attendanceRecord.findMany({
      include: {
        staff: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
    return records.map((r) => this.mapToEntity(r)!);
  }
}
