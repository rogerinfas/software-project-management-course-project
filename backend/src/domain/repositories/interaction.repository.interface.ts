import { ProspectInteractionEntity } from '../entities/interaction.entity';

export interface IProspectInteractionRepository {
  create(
    interaction: Partial<ProspectInteractionEntity>,
  ): Promise<ProspectInteractionEntity>;

  findById(id: string): Promise<ProspectInteractionEntity | null>;

  update(
    id: string,
    interaction: Partial<ProspectInteractionEntity>,
  ): Promise<ProspectInteractionEntity>;

  findByProspectId(
    prospectId: string,
  ): Promise<ProspectInteractionEntity[]>;
}
