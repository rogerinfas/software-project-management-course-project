import { EvaluationResultEntity } from './evaluation-result.entity';
import { EvaluationStatus } from '@prisma/client';

describe('EvaluationResultEntity', () => {
  it('should create an EvaluationResultEntity instance and populate fields', () => {
    const data = {
      id: 'eval-1',
      prospectId: 'prospect-1',
      aptitude: EvaluationStatus.APROBADO,
      comments: 'Buen perfil',
      evaluatorId: 'evaluator-1',
      date: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new EvaluationResultEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.prospectId).toBe(data.prospectId);
    expect(entity.aptitude).toBe(data.aptitude);
    expect(entity.comments).toBe(data.comments);
    expect(entity.evaluatorId).toBe(data.evaluatorId);
    expect(entity.date).toBe(data.date);
  });
});
