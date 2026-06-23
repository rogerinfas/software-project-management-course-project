import { ENROLLMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { STAFF_PROFILE_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { PAYMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_INTERACTION_REPOSITORY } from '../../../../config/constants/tokens';
import { GUARDIAN_REPOSITORY } from '../../../../config/constants/tokens';
import { EVALUATION_RESULT_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IEnrollmentRepository } from '../../../../domain/repositories/enrollment.repository.interface';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

export class GetEnrollmentDocumentsQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly size: number,
    public readonly search?: string,
  ) {}
}

@QueryHandler(GetEnrollmentDocumentsQuery)
export class GetEnrollmentDocumentsQueryHandler implements IQueryHandler<GetEnrollmentDocumentsQuery> {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly repository: IEnrollmentRepository,
  ) {}

  async execute(
    query: GetEnrollmentDocumentsQuery,
  ): Promise<PaginatedResult<EnrollmentEntity>> {
    return this.repository.findManyPaginated(
      query.page,
      query.size,
      query.search,
    );
  }
}
