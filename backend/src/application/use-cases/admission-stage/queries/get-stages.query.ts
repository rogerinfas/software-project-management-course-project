import { ADMISSION_STAGE_REPOSITORY } from '../../../../config/constants/tokens';
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
import { ENROLLMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { COURSE_REPOSITORY } from '../../../../config/constants/tokens';
import { COMMUNICATION_REPOSITORY } from '../../../../config/constants/tokens';
import { CHARGE_REPOSITORY } from '../../../../config/constants/tokens';
import { ATTENDANCE_RULE_REPOSITORY } from '../../../../config/constants/tokens';
import { ATTENDANCE_RECORD_REPOSITORY } from '../../../../config/constants/tokens';
import { APPOINTMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

export class GetStagesQuery implements IQuery {}

@QueryHandler(GetStagesQuery)
export class GetStagesQueryHandler implements IQueryHandler<GetStagesQuery> {
  constructor(
    @Inject(ADMISSION_STAGE_REPOSITORY)
    private readonly repository: IAdmissionStageRepository,
  ) {}

  async execute(query: GetStagesQuery): Promise<AdmissionStageEntity[]> {
    // 1. Obtener todas las etapas de admisión junto con sus prospectos asociados
    // Esto se utiliza para renderizar el tablero Kanban en el frontend con todos los postulantes.
    return this.repository.findAllWithProspects();
  }
}
