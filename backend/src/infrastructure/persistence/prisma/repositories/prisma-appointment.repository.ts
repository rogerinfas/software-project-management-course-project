import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';

@Injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    appointment: Partial<AppointmentEntity>,
  ): Promise<AppointmentEntity> {
    const created = await this.prisma.appointment.create({
      data: {
        prospectId: appointment.prospectId!,
        date: appointment.date!,
        type: appointment.type!,
        notes: appointment.notes,
      },
      include: {
        prospect: true,
      },
    });

    const { prospect, ...appointmentData } = created;
    const entity = new AppointmentEntity(appointmentData);
    entity.prospect = new ProspectEntity(prospect);
    return entity;
  }

  async findAll(): Promise<AppointmentEntity[]> {
    const list = await this.prisma.appointment.findMany({
      orderBy: { date: 'asc' },
      include: {
        prospect: true,
      },
    });

    return list.map((item) => {
      const { prospect, ...appointmentData } = item;
      const entity = new AppointmentEntity(appointmentData);
      entity.prospect = new ProspectEntity(prospect);
      return entity;
    });
  }
}
