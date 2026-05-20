import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IEvaluationResultRepository } from '../../../../domain/repositories/evaluation-result.repository.interface';
import { EvaluationResultEntity } from '../../../../domain/entities/evaluation-result.entity';

@Injectable()
export class PrismaEvaluationResultRepository implements IEvaluationResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProspectId(
    prospectId: string,
  ): Promise<EvaluationResultEntity | null> {
    const res = await this.prisma.evaluationResult.findUnique({
      where: { prospectId },
    });
    return res ? new EvaluationResultEntity(res) : null;
  }

  async create(
    evaluation: Partial<EvaluationResultEntity>,
  ): Promise<EvaluationResultEntity> {
    const created = await this.prisma.evaluationResult.create({
      data: {
        prospectId: evaluation.prospectId!,
        aptitude: evaluation.aptitude!,
        comments: evaluation.comments,
        evaluatorId: evaluation.evaluatorId,
      },
    });
    return new EvaluationResultEntity(created);
  }

  async update(
    prospectId: string,
    evaluation: Partial<EvaluationResultEntity>,
  ): Promise<EvaluationResultEntity> {
    const updated = await this.prisma.evaluationResult.update({
      where: { prospectId },
      data: {
        aptitude: evaluation.aptitude,
        comments: evaluation.comments,
        evaluatorId: evaluation.evaluatorId,
        date: evaluation.date || new Date(),
      },
    });
    return new EvaluationResultEntity(updated);
  }
}
