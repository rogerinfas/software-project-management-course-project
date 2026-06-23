import { PaymentEntity } from '../entities/payment.entity';

export interface IPaymentRepository {
  create(payment: Partial<PaymentEntity>): Promise<PaymentEntity>;
  findById(id: string): Promise<PaymentEntity | null>;
  findByChargeId(chargeId: string): Promise<PaymentEntity[]>;
  findByStudentId(studentId: string): Promise<PaymentEntity[]>;
  findAll(): Promise<PaymentEntity[]>;
}
