import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_INTERACTION_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { STAFF_PROFILE_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
import { PAYMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IProspectInteractionRepository } from '../../../../domain/repositories/interaction.repository.interface';
import type { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';

export class GetInteractionsQuery implements IQuery {
  constructor(public readonly prospectId: string) {}
}

@QueryHandler(GetInteractionsQuery)
export class GetInteractionsQueryHandler implements IQueryHandler<GetInteractionsQuery> {
  constructor(
    @Inject(PROSPECT_INTERACTION_REPOSITORY)
    private readonly repository: IProspectInteractionRepository,
    @Inject(PROSPECT_REPOSITORY)
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
