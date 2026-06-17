import { ChargeEntity } from './charge.entity';

describe('ChargeEntity', () => {
  it('should create a ChargeEntity instance and populate fields', () => {
    const data = {
      id: 'charge-1',
      studentId: 'student-1',
      tariffId: 'tariff-1',
      originalAmount: 100.0,
      pendingAmount: 100.0,
      dueDate: new Date(),
      status: 'PENDING',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new ChargeEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.studentId).toBe(data.studentId);
    expect(entity.tariffId).toBe(data.tariffId);
    expect(entity.originalAmount).toBe(data.originalAmount);
    expect(entity.pendingAmount).toBe(data.pendingAmount);
    expect(entity.dueDate).toBe(data.dueDate);
    expect(entity.status).toBe(data.status);
  });
});
