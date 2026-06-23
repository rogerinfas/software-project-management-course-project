import { ADMISSION_STAGE_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { STAFF_PROFILE_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
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
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import type { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';

export class UpdateProspectStageCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly currentStageId: string,
  ) {}
}

@CommandHandler(UpdateProspectStageCommand)
export class UpdateProspectStageCommandHandler implements ICommandHandler<UpdateProspectStageCommand> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly repository: IProspectRepository,
    @Inject(ADMISSION_STAGE_REPOSITORY)
    private readonly stageRepository: IAdmissionStageRepository,
  ) {}

  async execute(command: UpdateProspectStageCommand): Promise<ProspectEntity> {
    // 1. Verificar si el postulante (prospect) existe en la base de datos
    const prospect = await this.repository.findById(command.id);
    if (!prospect) {
      // Si no existe, lanzar excepción HTTP 404
      throw new NotFoundException('Prospect not found');
    }

    // 2. Verificar si la etapa destino (target stage) existe en el pipeline
    const stage = await this.stageRepository.findById(command.currentStageId);
    if (!stage) {
      // Si la etapa destino no existe, lanzar excepción HTTP 404
      throw new NotFoundException('Target stage not found');
    }

    // 3. Actualizar la etapa actual del postulante en el repositorio (movimiento en tablero Kanban)
    return this.repository.update(command.id, {
      currentStageId: command.currentStageId,
    });
  }
}
