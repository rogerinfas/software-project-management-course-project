import { CommunicationEntity } from '../entities/communication.entity';
import { PaginatedResult } from './prospect.repository.interface';

export interface ICommunicationRepository {
  create(
    communication: Partial<CommunicationEntity>,
  ): Promise<CommunicationEntity>;
  findById(id: string): Promise<CommunicationEntity | null>;
  update(
    id: string,
    communication: Partial<CommunicationEntity>,
  ): Promise<CommunicationEntity>;
  delete(id: string): Promise<void>;
  findManyPaginated(
    page: number,
    size: number,
    category?: string,
    search?: string,
  ): Promise<PaginatedResult<CommunicationEntity>>;
  findAllActive(): Promise<CommunicationEntity[]>;
}
