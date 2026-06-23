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
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';

export class DeleteStageCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteStageCommand)
export class DeleteStageCommandHandler implements ICommandHandler<DeleteStageCommand> {
  constructor(
    @Inject(ADMISSION_STAGE_REPOSITORY)
    private readonly repository: IAdmissionStageRepository,
  ) {}

  async execute(command: DeleteStageCommand): Promise<void> {
    // 1. Buscar la etapa de admisión por su ID para verificar su existencia
    const stage = await this.repository.findById(command.id);
    if (!stage) {
      // Si la etapa no existe, lanzar excepción HTTP 404
      throw new NotFoundException('Stage not found');
    }

    // 2. Eliminar la etapa a través del repositorio
    await this.repository.delete(command.id);
  }
}
