import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAttendanceRuleRepository } from '../../../../domain/repositories/attendance-rule.repository.interface';
import { AttendanceRuleEntity } from '../../../../domain/entities/attendance-rule.entity';

@Injectable()
export class PrismaAttendanceRuleRepository implements IAttendanceRuleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(dbRecord: any): AttendanceRuleEntity | null {
    if (!dbRecord) return null;
    return new AttendanceRuleEntity(dbRecord);
  }

  async getRule(): Promise<AttendanceRuleEntity | null> {
    let record = await this.prisma.attendanceRule.findFirst();
    if (!record) {
      // Autocreate a default rule to avoid empty DB state failures
      record = await this.prisma.attendanceRule.create({
        data: {
          gracePeriodMinutes: 5,
          finePerMinute: 0.5,
        },
      });
    }
    return this.mapToEntity(record);
  }

  async updateRule(rule: Partial<AttendanceRuleEntity>): Promise<AttendanceRuleEntity> {
    const existing = await this.prisma.attendanceRule.findFirst();
    let record;
    if (existing) {
      record = await this.prisma.attendanceRule.update({
        where: { id: existing.id },
        data: {
          gracePeriodMinutes: rule.gracePeriodMinutes,
          finePerMinute: rule.finePerMinute,
        },
      });
    } else {
      record = await this.prisma.attendanceRule.create({
        data: {
          gracePeriodMinutes: rule.gracePeriodMinutes !== undefined ? rule.gracePeriodMinutes : 5,
          finePerMinute: rule.finePerMinute !== undefined ? rule.finePerMinute : 0.5,
        },
      });
    }
    return this.mapToEntity(record)!;
  }
}
