import { AttendanceRuleEntity } from '../entities/attendance-rule.entity';

export interface IAttendanceRuleRepository {
  getRule(): Promise<AttendanceRuleEntity | null>;
  updateRule(
    rule: Partial<AttendanceRuleEntity>,
  ): Promise<AttendanceRuleEntity>;
}
