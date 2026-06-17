import { ProspectInteractionEntity } from './interaction.entity';

describe('ProspectInteractionEntity', () => {
  it('should create a ProspectInteractionEntity instance and populate fields', () => {
    const data = {
      id: 'inter-1',
      prospectId: 'prospect-1',
      type: 'llamada',
      summary: 'Interesado en matrícula',
      author: 'Admin',
      date: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new ProspectInteractionEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.prospectId).toBe(data.prospectId);
    expect(entity.type).toBe(data.type);
    expect(entity.summary).toBe(data.summary);
    expect(entity.author).toBe(data.author);
    expect(entity.date).toBe(data.date);
  });
});
