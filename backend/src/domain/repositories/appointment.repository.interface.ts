import { AppointmentEntity } from '../entities/appointment.entity';

export interface IAppointmentRepository {
  create(
    appointment: Partial<AppointmentEntity>,
  ): Promise<AppointmentEntity>;
  findAll(): Promise<AppointmentEntity[]>;
}
