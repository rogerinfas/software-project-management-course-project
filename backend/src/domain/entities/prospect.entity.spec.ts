import { ProspectEntity } from './prospect.entity';
import { EducationalLevel, ProspectPriority, ProspectStage } from '@prisma/client';

describe('ProspectEntity', () => {
  it('should create a ProspectEntity instance and populate fields', () => {
    const data = {
      id: 'prosp-1',
      name: 'Pepito Pérez',
      phone: '999888777',
      targetGrade: '1',
      level: EducationalLevel.PRIMARY,
      priority: ProspectPriority.HIGH,
      stage: ProspectStage.ENTREVISTA,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new ProspectEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.name).toBe(data.name);
    expect(entity.phone).toBe(data.phone);
    expect(entity.targetGrade).toBe(data.targetGrade);
    expect(entity.level).toBe(data.level);
    expect(entity.priority).toBe(data.priority);
    expect(entity.stage).toBe(data.stage);
  });
});
