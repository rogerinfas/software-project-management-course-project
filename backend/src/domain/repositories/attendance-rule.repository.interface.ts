import { AttendanceRuleEntity } from '../entities/attendance-rule.entity';

export abstract class IAttendanceRuleRepository {
  abstract getRule(): Promise<AttendanceRuleEntity | null>;
  abstract updateRule(rule: Partial<AttendanceRuleEntity>): Promise<AttendanceRuleEntity>;
}
