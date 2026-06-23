import { GuardianEntity } from '../entities/guardian.entity';
import { PaginatedResult } from './prospect.repository.interface';

export interface IGuardianRepository {
  create(guardian: Partial<GuardianEntity>): Promise<GuardianEntity>;
  findById(id: string): Promise<GuardianEntity | null>;
  findByDni(dni: string): Promise<GuardianEntity | null>;
  update(
    id: string,
    guardian: Partial<GuardianEntity>,
  ): Promise<GuardianEntity>;
  delete(id: string): Promise<GuardianEntity>;
  findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<GuardianEntity>>;
  findAll(): Promise<GuardianEntity[]>;
}
