import { AdmissionStageEntity } from './admission-stage.entity';

describe('AdmissionStageEntity', () => {
  it('should create an AdmissionStageEntity instance and populate fields', () => {
    const data = {
      id: 'stage-1',
      name: 'Entrevista',
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new AdmissionStageEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.name).toBe(data.name);
    expect(entity.order).toBe(data.order);
  });
});
