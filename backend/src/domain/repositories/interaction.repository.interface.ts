import { ProspectInteractionEntity } from '../entities/interaction.entity';

export abstract class IProspectInteractionRepository {
  abstract create(
    interaction: Partial<ProspectInteractionEntity>,
  ): Promise<ProspectInteractionEntity>;
  
  abstract findById(id: string): Promise<ProspectInteractionEntity | null>;
  
  abstract update(
    id: string,
    interaction: Partial<ProspectInteractionEntity>,
  ): Promise<ProspectInteractionEntity>;
  
  abstract findByProspectId(
    prospectId: string,
  ): Promise<ProspectInteractionEntity[]>;
}
