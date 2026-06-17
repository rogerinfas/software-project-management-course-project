import { SectionEntity } from './section.entity';
import { EducationalLevel } from '@prisma/client';

describe('SectionEntity', () => {
  it('should create a SectionEntity instance and populate fields', () => {
    const data = {
      id: 'section-1',
      name: 'Aula A',
      grade: '1',
      level: EducationalLevel.PRIMARY,
      capacity: 30,
      status: 'ACTIVE',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new SectionEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.name).toBe(data.name);
    expect(entity.grade).toBe(data.grade);
    expect(entity.level).toBe(data.level);
    expect(entity.capacity).toBe(data.capacity);
    expect(entity.status).toBe(data.status);
  });
});
