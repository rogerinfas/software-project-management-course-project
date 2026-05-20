import { AppointmentEntity } from '../entities/appointment.entity';

export abstract class IAppointmentRepository {
  abstract create(
    appointment: Partial<AppointmentEntity>,
  ): Promise<AppointmentEntity>;
  abstract findAll(): Promise<AppointmentEntity[]>;
}
