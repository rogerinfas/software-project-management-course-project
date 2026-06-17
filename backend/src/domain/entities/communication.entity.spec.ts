import { CommunicationEntity } from './communication.entity';

describe('CommunicationEntity', () => {
  it('should create a CommunicationEntity instance and populate fields', () => {
    const data = {
      id: 'comm-1',
      title: 'Feriado',
      content: 'No clases',
      category: 'ANNOUNCEMENT',
      isVisible: true,
      expiresAt: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new CommunicationEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.title).toBe(data.title);
    expect(entity.content).toBe(data.content);
    expect(entity.category).toBe(data.category);
    expect(entity.isVisible).toBe(data.isVisible);
    expect(entity.expiresAt).toBe(data.expiresAt);
  });
});
