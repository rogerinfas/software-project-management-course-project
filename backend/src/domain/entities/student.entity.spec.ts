import { StudentEntity } from './student.entity';
import { EducationalLevel } from '@prisma/client';

describe('StudentEntity', () => {
  it('should create a StudentEntity instance and populate fields', () => {
    const data = {
      id: 'student-1',
      code: 'EST-2026-001',
      firstName: 'Pepito',
      lastName: 'Pérez',
      dni: '87654321',
      level: EducationalLevel.PRIMARIA,
      grade: '1',
      sectionId: 'section-123',
      guardianId: 'guardian-123',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new StudentEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.code).toBe(data.code);
    expect(entity.firstName).toBe(data.firstName);
    expect(entity.lastName).toBe(data.lastName);
    expect(entity.dni).toBe(data.dni);
    expect(entity.level).toBe(data.level);
    expect(entity.grade).toBe(data.grade);
    expect(entity.sectionId).toBe(data.sectionId);
    expect(entity.guardianId).toBe(data.guardianId);
  });
});
