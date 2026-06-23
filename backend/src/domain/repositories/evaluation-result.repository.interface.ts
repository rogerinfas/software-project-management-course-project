import { EvaluationResultEntity } from '../entities/evaluation-result.entity';

export interface IEvaluationResultRepository {
  findByProspectId(
    prospectId: string,
  ): Promise<EvaluationResultEntity | null>;
  create(
    evaluation: Partial<EvaluationResultEntity>,
  ): Promise<EvaluationResultEntity>;
  update(
    prospectId: string,
    evaluation: Partial<EvaluationResultEntity>,
  ): Promise<EvaluationResultEntity>;
}
