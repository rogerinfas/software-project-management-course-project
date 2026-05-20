import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import {
  IProspectRepository,
  PaginatedResult,
} from '../../../../domain/repositories/prospect.repository.interface';
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

  async findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<ProspectEntity>> {
    const where: Prisma.ProspectWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [total, prospects] = await this.prisma.$transaction([
      this.prisma.prospect.count({ where }),
      this.prisma.prospect.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: {
          appointments: true,
          evaluation: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / size);

    const data = prospects.map((p) => {
      const { appointments, evaluation, ...prospectData } = p;
      const entity = new ProspectEntity(prospectData);
      entity.appointments = appointments.map(
        (app) => new AppointmentEntity(app),
      );
      entity.evaluation = evaluation
        ? new EvaluationResultEntity(evaluation)
        : null;
      return entity;
    });

    return {
      data,
      meta: {
        total,
        page,
        size,
        totalPages,
        hasNext: page < totalPages,
      },
    };
  }
}
