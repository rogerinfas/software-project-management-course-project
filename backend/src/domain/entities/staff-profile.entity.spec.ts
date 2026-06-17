import { StaffProfileEntity } from './staff-profile.entity';

describe('StaffProfileEntity', () => {
  it('should create a StaffProfileEntity instance and populate fields', () => {
    const data = {
      id: 'staff-1',
      userId: 'user-123',
      specialty: 'Matemáticas',
      cvUrl: 'http://test.com/cv.pdf',
      entryTime: '08:00',
      exitTime: '16:00',
      gracePeriod: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new StaffProfileEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.userId).toBe(data.userId);
    expect(entity.specialty).toBe(data.specialty);
    expect(entity.cvUrl).toBe(data.cvUrl);
    expect(entity.entryTime).toBe(data.entryTime);
    expect(entity.exitTime).toBe(data.exitTime);
    expect(entity.gracePeriod).toBe(data.gracePeriod);
  });
});
