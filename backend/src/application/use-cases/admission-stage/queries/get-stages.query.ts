import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

export class GetStagesQuery implements IQuery {}

@QueryHandler(GetStagesQuery)
export class GetStagesQueryHandler implements IQueryHandler<GetStagesQuery> {
  constructor(
    @Inject('IAdmissionStageRepository')
    private readonly repository: IAdmissionStageRepository,
  ) {}

  async execute(query: GetStagesQuery): Promise<AdmissionStageEntity[]> {
    // 1. Obtener todas las etapas de admisión junto con sus prospectos asociados
    // Esto se utiliza para renderizar el tablero Kanban en el frontend con todos los postulantes.
    return this.repository.findAllWithProspects();
  }
}
