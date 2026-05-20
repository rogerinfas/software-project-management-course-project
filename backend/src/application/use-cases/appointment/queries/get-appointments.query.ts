import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';

export class GetAppointmentsQuery implements IQuery {}

@QueryHandler(GetAppointmentsQuery)
export class GetAppointmentsQueryHandler implements IQueryHandler<GetAppointmentsQuery> {
  constructor(
    @Inject('IAppointmentRepository')
    private readonly repository: IAppointmentRepository,
  ) {}

  async execute(query: GetAppointmentsQuery): Promise<AppointmentEntity[]> {
    // 1. Obtener el listado completo de citas agendadas con sus relaciones (ej. prospectos)
    // Esto se usa en la vista general de la agenda de citas.
    return this.repository.findAll();
  }
}
