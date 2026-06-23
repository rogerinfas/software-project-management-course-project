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
import { Inject } from '@nestjs/common';
import type { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

export class CreateStageCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly order: number,
  ) {}
}

@CommandHandler(CreateStageCommand)
export class CreateStageCommandHandler implements ICommandHandler<CreateStageCommand> {
  constructor(
    @Inject(ADMISSION_STAGE_REPOSITORY)
    private readonly repository: IAdmissionStageRepository,
  ) {}

  async execute(command: CreateStageCommand): Promise<AdmissionStageEntity> {
    // 1. Extraer los datos necesarios (nombre de la etapa y orden secuencial) del comando
    const { name, order } = command;

    // 2. Persistir la nueva etapa de admisión en la base de datos a través del repositorio
    return this.repository.create({ name, order });
  }
}
