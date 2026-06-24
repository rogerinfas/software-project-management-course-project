import { APPOINTMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
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
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';

export class GetAppointmentsQuery implements IQuery {}

@QueryHandler(GetAppointmentsQuery)
export class GetAppointmentsQueryHandler implements IQueryHandler<GetAppointmentsQuery> {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly repository: IAppointmentRepository,
  ) {}

  async execute(query: GetAppointmentsQuery): Promise<AppointmentEntity[]> {
    // 1. Obtener el listado completo de citas agendadas con sus relaciones (ej. prospectos)
    // Esto se usa en la vista general de la agenda de citas.
    return this.repository.findAll();
  }
}
