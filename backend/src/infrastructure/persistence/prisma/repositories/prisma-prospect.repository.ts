import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';
import { EvaluationResultEntity } from '../../../../domain/entities/evaluation-result.entity';

@Injectable()
export class PrismaProspectRepository implements IProspectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(prospect: Partial<ProspectEntity>): Promise<ProspectEntity> {
    const created = await this.prisma.prospect.create({
      data: {
        name: prospect.name!,
        phone: prospect.phone!,
        targetGrade: prospect.targetGrade!,
        level: prospect.level!,
        priority: prospect.priority!,
        currentStageId: prospect.currentStageId!,
      },
      include: {
        appointments: true,
        evaluation: true,
      },
    });

    const { appointments, evaluation, ...prospectData } = created;
    const entity = new ProspectEntity(prospectData);
    entity.appointments = appointments.map((app) => new AppointmentEntity(app));
    entity.evaluation = evaluation
      ? new EvaluationResultEntity(evaluation)
      : null;
    return entity;
  }

  async findById(id: string): Promise<ProspectEntity | null> {
    const p = await this.prisma.prospect.findUnique({
      where: { id },
      include: {
        appointments: true,
        evaluation: true,
      },
    });
    if (!p) return null;

    const { appointments, evaluation, ...prospectData } = p;
    const entity = new ProspectEntity(prospectData);
    entity.appointments = appointments.map((app) => new AppointmentEntity(app));
    entity.evaluation = evaluation
      ? new EvaluationResultEntity(evaluation)
      : null;
    return entity;
  }

  async update(
    id: string,
    prospect: Partial<ProspectEntity>,
  ): Promise<ProspectEntity> {
    const updated = await this.prisma.prospect.update({
      where: { id },
      data: {
        name: prospect.name,
        phone: prospect.phone,
        targetGrade: prospect.targetGrade,
        level: prospect.level,
        priority: prospect.priority,
        currentStageId: prospect.currentStageId,
      },
      include: {
        appointments: true,
        evaluation: true,
      },
    });

    const { appointments, evaluation, ...prospectData } = updated;
    const entity = new ProspectEntity(prospectData);
    entity.appointments = appointments.map((app) => new AppointmentEntity(app));
    entity.evaluation = evaluation
      ? new EvaluationResultEntity(evaluation)
      : null;
    return entity;
  }
}
