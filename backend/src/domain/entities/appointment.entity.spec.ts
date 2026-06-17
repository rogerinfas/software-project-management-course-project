import { AppointmentEntity } from './appointment.entity';

describe('AppointmentEntity', () => {
  it('should create an AppointmentEntity instance and populate fields', () => {
    const data = {
      id: 'app-1',
      date: new Date(),
      type: 'Entrevista',
      prospectId: 'prospect-1',
      notes: 'Llamar antes',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new AppointmentEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.date).toBe(data.date);
    expect(entity.type).toBe(data.type);
    expect(entity.prospectId).toBe(data.prospectId);
    expect(entity.notes).toBe(data.notes);
  });
});
