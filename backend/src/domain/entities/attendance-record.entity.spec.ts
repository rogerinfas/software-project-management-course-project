import { AttendanceRecordEntity } from './attendance-record.entity';

describe('AttendanceRecordEntity', () => {
  it('should create an AttendanceRecordEntity instance and populate fields', () => {
    const data = {
      id: 'att-1',
      staffId: 'staff-1',
      type: 'entry',
      timestamp: new Date(),
      method: 'FACIAL',
      delayMinutes: 10,
      fineAmount: 5.0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new AttendanceRecordEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.staffId).toBe(data.staffId);
    expect(entity.type).toBe(data.type);
    expect(entity.timestamp).toBe(data.timestamp);
    expect(entity.method).toBe(data.method);
    expect(entity.delayMinutes).toBe(data.delayMinutes);
    expect(entity.fineAmount).toBe(data.fineAmount);
  });
});
