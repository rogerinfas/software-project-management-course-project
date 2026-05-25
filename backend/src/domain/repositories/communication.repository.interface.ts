import { CommunicationEntity } from '../entities/communication.entity';
import { PaginatedResult } from './prospect.repository.interface';

export abstract class ICommunicationRepository {
  abstract create(communication: Partial<CommunicationEntity>): Promise<CommunicationEntity>;
  abstract findById(id: string): Promise<CommunicationEntity | null>;
  abstract update(
    id: string,
    communication: Partial<CommunicationEntity>,
  ): Promise<CommunicationEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findManyPaginated(
    page: number,
    size: number,
    category?: string,
    search?: string,
  ): Promise<PaginatedResult<CommunicationEntity>>;
  abstract findAllActive(): Promise<CommunicationEntity[]>;
}
