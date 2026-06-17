import { GuardianEntity } from './guardian.entity';

describe('GuardianEntity', () => {
  it('should create a GuardianEntity instance and populate fields', () => {
    const data = {
      id: 'guardian-1',
      dni: '12345678',
      name: 'Jane Doe',
      phone: '987654321',
      email: 'jane@example.com',
      occupation: 'Ingeniera',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new GuardianEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.dni).toBe(data.dni);
    expect(entity.name).toBe(data.name);
    expect(entity.phone).toBe(data.phone);
    expect(entity.email).toBe(data.email);
    expect(entity.occupation).toBe(data.occupation);
  });
});
