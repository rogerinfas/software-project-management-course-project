import { ProspectEntity } from '../entities/prospect.entity';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export abstract class IProspectRepository {
  abstract create(prospect: Partial<ProspectEntity>): Promise<ProspectEntity>;
  abstract findById(id: string): Promise<ProspectEntity | null>;
  abstract update(
    id: string,
    prospect: Partial<ProspectEntity>,
  ): Promise<ProspectEntity>;
  abstract findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<ProspectEntity>>;
}
