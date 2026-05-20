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
    return this.repository.findAllWithProspects();
  }
}
