import { GuardianEntity } from '../entities/guardian.entity';
import { PaginatedResult } from './prospect.repository.interface';

export abstract class IGuardianRepository {
  abstract create(guardian: Partial<GuardianEntity>): Promise<GuardianEntity>;
  abstract findById(id: string): Promise<GuardianEntity | null>;
  abstract findByDni(dni: string): Promise<GuardianEntity | null>;
  abstract update(
    id: string,
    guardian: Partial<GuardianEntity>,
  ): Promise<GuardianEntity>;
  abstract delete(id: string): Promise<GuardianEntity>;
  abstract findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<GuardianEntity>>;
  abstract findAll(): Promise<GuardianEntity[]>;
}
