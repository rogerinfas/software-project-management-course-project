import { ChargeEntity } from '../entities/charge.entity';

export interface IChargeRepository {
  create(charge: Partial<ChargeEntity>): Promise<ChargeEntity>;
  findById(id: string): Promise<ChargeEntity | null>;
  update(id: string, charge: Partial<ChargeEntity>): Promise<ChargeEntity>;
  delete(id: string): Promise<void>;
  findByStudentId(studentId: string): Promise<ChargeEntity[]>;
  findAll(): Promise<ChargeEntity[]>;
}
