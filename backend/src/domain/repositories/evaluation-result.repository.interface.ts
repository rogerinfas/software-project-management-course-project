import { EvaluationResultEntity } from '../entities/evaluation-result.entity';

export abstract class IEvaluationResultRepository {
  abstract findByProspectId(
    prospectId: string,
  ): Promise<EvaluationResultEntity | null>;
  abstract create(
    evaluation: Partial<EvaluationResultEntity>,
  ): Promise<EvaluationResultEntity>;
  abstract update(
    prospectId: string,
    evaluation: Partial<EvaluationResultEntity>,
  ): Promise<EvaluationResultEntity>;
}
