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

export interface IProspectRepository {
  create(prospect: Partial<ProspectEntity>): Promise<ProspectEntity>;
  findById(id: string): Promise<ProspectEntity | null>;
  update(
    id: string,
    prospect: Partial<ProspectEntity>,
  ): Promise<ProspectEntity>;
  findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<ProspectEntity>>;
}
