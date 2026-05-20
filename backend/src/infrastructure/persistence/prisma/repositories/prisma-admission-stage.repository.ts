import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';
import { EvaluationResultEntity } from '../../../../domain/entities/evaluation-result.entity';

@Injectable()
export class PrismaAdmissionStageRepository implements IAdmissionStageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    stage: Partial<AdmissionStageEntity>,
  ): Promise<AdmissionStageEntity> {
    const created = await this.prisma.admissionStage.create({
      data: {
        name: stage.name!,
        order: stage.order!,
      },
    });
    return new AdmissionStageEntity(created);
  }

  async findAllWithProspects(): Promise<AdmissionStageEntity[]> {
    const stages = await this.prisma.admissionStage.findMany({
      orderBy: { order: 'asc' },
      include: {
        prospects: {
          orderBy: { createdAt: 'desc' },
          include: {
            appointments: true,
            evaluation: true,
          },
        },
      },
    });

    return stages.map((s) => {
      const { prospects, ...stageData } = s;
      const stage = new AdmissionStageEntity(stageData);
      stage.prospects = prospects.map((p) => {
        const { appointments, evaluation, ...prospectData } = p;
        const prospect = new ProspectEntity(prospectData);
        prospect.appointments = appointments.map(
          (app) => new AppointmentEntity(app),
        );
        prospect.evaluation = evaluation
          ? new EvaluationResultEntity(evaluation)
          : null;
        return prospect;
      });
      return stage;
    });
  }

  async findById(id: string): Promise<AdmissionStageEntity | null> {
    const stage = await this.prisma.admissionStage.findUnique({
      where: { id },
    });
    return stage ? new AdmissionStageEntity(stage) : null;
  }

  async update(
    id: string,
    stage: Partial<AdmissionStageEntity>,
  ): Promise<AdmissionStageEntity> {
    const updated = await this.prisma.admissionStage.update({
      where: { id },
      data: {
        name: stage.name,
        order: stage.order,
      },
    });
    return new AdmissionStageEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.admissionStage.delete({
      where: { id },
    });
  }
}
