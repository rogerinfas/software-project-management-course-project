import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IEnrollmentRepository } from '../../../../domain/repositories/enrollment.repository.interface';
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
export class GetEnrollmentDocumentsQueryHandler
  implements IQueryHandler<GetEnrollmentDocumentsQuery>
{
  constructor(
    @Inject('IEnrollmentRepository')
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
