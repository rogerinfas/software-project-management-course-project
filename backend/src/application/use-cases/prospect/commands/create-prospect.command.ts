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
import { EducationalLevel, ProspectPriority } from '@prisma/client';

export class CreateProspectCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly phone: string,
    public readonly targetGrade: string,
    public readonly level: EducationalLevel,
    public readonly priority: ProspectPriority,
    public readonly currentStageId: string,
  ) {}
}

@CommandHandler(CreateProspectCommand)
export class CreateProspectCommandHandler implements ICommandHandler<CreateProspectCommand> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly repository: IProspectRepository,
    @Inject(ADMISSION_STAGE_REPOSITORY)
    private readonly stageRepository: IAdmissionStageRepository,
  ) {}

  async execute(command: CreateProspectCommand): Promise<ProspectEntity> {
    // 1. Validar si la etapa inicial (stage) asignada al postulante existe en el pipeline
    const stage = await this.stageRepository.findById(command.currentStageId);
    if (!stage) {
      // Si la etapa de admisión no existe, lanzar excepción HTTP 404
      throw new NotFoundException('Stage not found');
    }

    // 2. Crear y persistir el nuevo prospecto (postulante) en el repositorio
    return this.repository.create({
      name: command.name,
      phone: command.phone,
      targetGrade: command.targetGrade,
      level: command.level,
      priority: command.priority,
      currentStageId: command.currentStageId,
    });
  }
}
