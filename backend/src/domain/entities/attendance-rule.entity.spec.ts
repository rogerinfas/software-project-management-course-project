import { AttendanceRuleEntity } from './attendance-rule.entity';

describe('AttendanceRuleEntity', () => {
  it('should create an AttendanceRuleEntity instance and populate fields', () => {
    const data = {
      id: 'rule-1',
      gracePeriodMinutes: 10,
      finePerMinute: 0.5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new AttendanceRuleEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.gracePeriodMinutes).toBe(data.gracePeriodMinutes);
    expect(entity.finePerMinute).toBe(data.finePerMinute);
  });
});
