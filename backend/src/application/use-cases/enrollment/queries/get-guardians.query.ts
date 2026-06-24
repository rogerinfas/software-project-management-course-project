import { GUARDIAN_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { PAYMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_INTERACTION_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

export class GetGuardiansQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly size: number,
    public readonly search?: string,
  ) {}
}

@QueryHandler(GetGuardiansQuery)
export class GetGuardiansQueryHandler implements IQueryHandler<GetGuardiansQuery> {
  constructor(
    @Inject(GUARDIAN_REPOSITORY)
    private readonly repository: IGuardianRepository,
  ) {}

  async execute(
    query: GetGuardiansQuery,
  ): Promise<PaginatedResult<GuardianEntity>> {
    return this.repository.findManyPaginated(
      query.page,
      query.size,
      query.search,
    );
  }
}
