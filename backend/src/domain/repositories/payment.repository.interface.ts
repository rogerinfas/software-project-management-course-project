import { PaymentEntity } from '../entities/payment.entity';

export abstract class IPaymentRepository {
  abstract create(payment: Partial<PaymentEntity>): Promise<PaymentEntity>;
  abstract findById(id: string): Promise<PaymentEntity | null>;
  abstract findByChargeId(chargeId: string): Promise<PaymentEntity[]>;
  abstract findByStudentId(studentId: string): Promise<PaymentEntity[]>;
  abstract findAll(): Promise<PaymentEntity[]>;
}
