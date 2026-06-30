import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { PaginatedResult } from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';

import { EvaluationStatus } from '@prisma/client';

export class GetProspectsPaginatedQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly size: number,
    public readonly search?: string,
    public readonly aptitude?: EvaluationStatus,
    public readonly includeFormalized?: boolean,
  ) {}
}

@QueryHandler(GetProspectsPaginatedQuery)
export class GetProspectsPaginatedQueryHandler implements IQueryHandler<GetProspectsPaginatedQuery> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly repository: IProspectRepository,
  ) {}

  async execute(
    query: GetProspectsPaginatedQuery,
  ): Promise<PaginatedResult<ProspectEntity>> {
    // 1. Ejecutar la query paginada en el repositorio de postulantes
    // Pasa la página (1-indexed), el tamaño de página y el término de búsqueda opcional.
    // Esto optimiza el consumo de red y base de datos evitando traer miles de registros a la vez.
    const results = await this.repository.findManyPaginated(
      query.page,
      query.size,
      query.search,
      query.aptitude,
      query.includeFormalized
    );
    return results;
  }
}

export const ProspectQueryHandlers = [GetProspectsPaginatedQueryHandler];
