import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../../../domain/repositories/student.repository.interface';
import { StudentEntity } from '../../../../domain/entities/student.entity';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';

export class GetStudentsQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly size: number,
    public readonly search?: string,
  ) {}
}

@QueryHandler(GetStudentsQuery)
export class GetStudentsQueryHandler implements IQueryHandler<GetStudentsQuery> {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly repository: IStudentRepository,
  ) {}

  async execute(
    query: GetStudentsQuery,
  ): Promise<PaginatedResult<StudentEntity>> {
    return this.repository.findManyPaginated(
      query.page,
      query.size,
      query.search,
    );
  }
}
