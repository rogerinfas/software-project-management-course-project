import { ProspectEntity } from '../entities/prospect.entity';

export abstract class IProspectRepository {
  abstract create(prospect: Partial<ProspectEntity>): Promise<ProspectEntity>;
  abstract findById(id: string): Promise<ProspectEntity | null>;
  abstract update(
    id: string,
    prospect: Partial<ProspectEntity>,
  ): Promise<ProspectEntity>;
}
