import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IProspectInteractionRepository } from '../../../../domain/repositories/interaction.repository.interface';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';

export class GetInteractionsQuery implements IQuery {
  constructor(public readonly prospectId: string) {}
}

@QueryHandler(GetInteractionsQuery)
export class GetInteractionsQueryHandler
  implements IQueryHandler<GetInteractionsQuery>
{
  constructor(
    @Inject('IProspectInteractionRepository')
    private readonly repository: IProspectInteractionRepository,
    @Inject('IProspectRepository')
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(
    query: GetInteractionsQuery,
  ): Promise<ProspectInteractionEntity[]> {
    const prospect = await this.prospectRepository.findById(query.prospectId);
    if (!prospect) {
      throw new NotFoundException('Prospect not found');
    }

    return this.repository.findByProspectId(query.prospectId);
  }
}
