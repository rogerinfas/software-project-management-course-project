import { PaymentEntity } from './payment.entity';
import { PaymentMethod } from '@prisma/client';

describe('PaymentEntity', () => {
  it('should create a PaymentEntity instance and populate fields', () => {
    const data = {
      id: 'pay-1',
      chargeId: 'charge-1',
      studentId: 'student-1',
      totalAmount: 100.0,
      method: PaymentMethod.EFECTIVO,
      timestamp: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new PaymentEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.chargeId).toBe(data.chargeId);
    expect(entity.studentId).toBe(data.studentId);
    expect(entity.totalAmount).toBe(data.totalAmount);
    expect(entity.method).toBe(data.method);
    expect(entity.timestamp).toBe(data.timestamp);
  });
});
