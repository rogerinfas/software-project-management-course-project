import { UserEntity } from './user.entity';
import { Role } from '@prisma/client';

describe('UserEntity', () => {
  it('should create a UserEntity instance and populate fields', () => {
    const data = {
      id: 'user-1',
      email: 'test@example.com',
      emailVerified: true,
      name: 'John Doe',
      role: Role.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new UserEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.email).toBe(data.email);
    expect(entity.emailVerified).toBe(data.emailVerified);
    expect(entity.name).toBe(data.name);
    expect(entity.role).toBe(data.role);
    expect(entity.isActive).toBe(true);
  });

  it('should support toggleActive state', () => {
    const entity = new UserEntity({ isActive: true });
    expect(entity.isActive).toBe(true);

    entity.toggleActive();
    expect(entity.isActive).toBe(false);
    expect(entity.deletedAt).toBeDefined();

    entity.toggleActive();
    expect(entity.isActive).toBe(true);
    expect(entity.deletedAt).toBeUndefined();
  });
});
