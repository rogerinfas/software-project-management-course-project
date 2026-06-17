import { CourseEntity } from './course.entity';

describe('CourseEntity', () => {
  it('should create a CourseEntity instance and populate fields', () => {
    const data = {
      id: 'course-1',
      name: 'Matemáticas',
      description: 'Álgebra y geometría',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new CourseEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.name).toBe(data.name);
    expect(entity.description).toBe(data.description);
    expect(entity.isPersisted).toBe(true);
  });
});
