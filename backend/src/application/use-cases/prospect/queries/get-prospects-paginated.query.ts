import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { STAFF_PROFILE_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type {
  IProspectRepository,
} from '../../../../domain/repositories/prospect.repository.interface';
import {
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
    return this.repository.findManyPaginated(
      query.page,
      query.size,
      query.search,
    );
  }
}

export const ProspectQueryHandlers = [GetProspectsPaginatedQueryHandler];
