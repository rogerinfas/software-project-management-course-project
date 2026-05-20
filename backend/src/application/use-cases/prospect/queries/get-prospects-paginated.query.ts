import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IProspectRepository,
  PaginatedResult,
} from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';

export class GetProspectsPaginatedQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly size: number,
    public readonly search?: string,
  ) {}
}

@QueryHandler(GetProspectsPaginatedQuery)
export class GetProspectsPaginatedQueryHandler
  implements IQueryHandler<GetProspectsPaginatedQuery>
{
  constructor(
    @Inject('IProspectRepository')
    private readonly repository: IProspectRepository,
  ) {}

  async execute(
    query: GetProspectsPaginatedQuery,
  ): Promise<PaginatedResult<ProspectEntity>> {
    return this.repository.findManyPaginated(
      query.page,
      query.size,
      query.search,
    );
  }
}

export const ProspectQueryHandlers = [GetProspectsPaginatedQueryHandler];
