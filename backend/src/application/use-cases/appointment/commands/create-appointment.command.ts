import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { APPOINTMENT_REPOSITORY } from '../../../../config/constants/tokens';
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
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';
import type { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';

export class CreateAppointmentCommand implements ICommand {
  constructor(
    public readonly prospectId: string,
    public readonly date: Date,
    public readonly type: string,
    public readonly notes?: string,
  ) {}
}

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentCommandHandler implements ICommandHandler<CreateAppointmentCommand> {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly repository: IAppointmentRepository,
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<AppointmentEntity> {
    // 1. Verificar si el postulante (prospect) existe en la base de datos
    // Esto previene agendar citas para registros huérfanos o inexistentes.
    const prospect = await this.prospectRepository.findById(command.prospectId);
    if (!prospect) {
      // Si no existe, lanzar excepción HTTP 404
      throw new NotFoundException('Prospect not found');
    }

    // 2. Programar y guardar la nueva cita (entrevista, evaluación psicológica, etc.) en el repositorio
    return this.repository.create({
      prospectId: command.prospectId,
      date: new Date(command.date),
      type: command.type,
      notes: command.notes,
    });
  }
}
