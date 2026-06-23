import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';

@Injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: any): AppointmentEntity {
    const { prospect, ...appointmentData } = raw;
    const entity = new AppointmentEntity(appointmentData);
    entity.prospect = new ProspectEntity(prospect);
    return entity;
  }

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
      include: { prospect: true },
    });

    return this.toEntity(created);
  }

  async findAll(): Promise<AppointmentEntity[]> {
    const list = await this.prisma.appointment.findMany({
      orderBy: { date: 'asc' },
      include: { prospect: true },
    });

    return list.map((item) => this.toEntity(item));
  }
}
