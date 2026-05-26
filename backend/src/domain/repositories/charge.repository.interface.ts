import { ChargeEntity } from '../entities/charge.entity';

export abstract class IChargeRepository {
  abstract create(charge: Partial<ChargeEntity>): Promise<ChargeEntity>;
  abstract findById(id: string): Promise<ChargeEntity | null>;
  abstract update(id: string, charge: Partial<ChargeEntity>): Promise<ChargeEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findByStudentId(studentId: string): Promise<ChargeEntity[]>;
  abstract findAll(): Promise<ChargeEntity[]>;
}
