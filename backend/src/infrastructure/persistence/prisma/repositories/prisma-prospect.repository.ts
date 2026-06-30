import { Injectable } from '@nestjs/common';
import { Prisma, EvaluationStatus } from '@prisma/client';
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

  /** Mapea el registro de Prisma (con include) a la entidad de dominio. */
  private toEntity(raw: {
    appointments: unknown[];
    evaluation: unknown | null;
    [key: string]: unknown;
  }, isFormalized?: boolean): ProspectEntity {
    const { appointments, evaluation, ...prospectData } = raw;
    const entity = new ProspectEntity({ ...(prospectData as Partial<ProspectEntity>), isFormalized });
    entity.appointments = appointments.map(
      (app) => new AppointmentEntity(app as Partial<AppointmentEntity>),
    );
    entity.evaluation = evaluation
      ? new EvaluationResultEntity(
          evaluation as Partial<EvaluationResultEntity>,
        )
      : null;
    return entity;
  }

  async create(prospect: Partial<ProspectEntity>): Promise<ProspectEntity> {
    const created = await this.prisma.prospect.create({
      data: {
        name: prospect.name!,
        phone: prospect.phone!,
        targetGrade: prospect.targetGrade!,
        level: prospect.level!,
        priority: prospect.priority!,
        stage: prospect.stage!,
      },
      include: { appointments: true, evaluation: true },
    });
    return this.toEntity(created);
  }

  async findById(id: string): Promise<ProspectEntity | null> {
    const p = await this.prisma.prospect.findUnique({
      where: { id },
      include: { appointments: true, evaluation: true },
    });
    if (!p) return null;
    return this.toEntity(p);
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
        stage: prospect.stage,
      },
      include: { appointments: true, evaluation: true },
    });
    return this.toEntity(updated);
  }

  async findManyPaginated(
    page: number,
    size: number,
    search?: string,
    aptitude?: EvaluationStatus,
    includeFormalized?: boolean,
  ): Promise<PaginatedResult<ProspectEntity>> {
    const where: Prisma.ProspectWhereInput = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (aptitude) {
      where.evaluation = { aptitude };
    }

    // Exclude prospects that have already been converted to students
    const formalizedStudents = await this.prisma.student.findMany({
      where: { prospectId: { not: null } },
      select: { prospectId: true },
    });
    const formalizedProspectIds = formalizedStudents
      .map((s) => s.prospectId)
      .filter(Boolean) as string[];

    if (!includeFormalized && formalizedProspectIds.length > 0) {
      where.id = { notIn: formalizedProspectIds };
    }

    const [total, prospects] = await this.prisma.$transaction([
      this.prisma.prospect.count({ where }),
      this.prisma.prospect.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: { appointments: true, evaluation: true },
      }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: prospects.map((p) => this.toEntity(p, formalizedProspectIds.includes(p.id))),
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
