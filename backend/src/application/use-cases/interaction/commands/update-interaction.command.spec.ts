import { UpdateInteractionCommand, UpdateInteractionCommandHandler } from './update-interaction.command';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateInteractionCommandHandler', () => {
  let handler: UpdateInteractionCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    handler = new UpdateInteractionCommandHandler(repository);
  });

  it('should throw NotFoundException if interaction not found', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new UpdateInteractionCommand('i-1', 'Call', 'Updated');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should update interaction successfully if found', async () => {
    const existing = new ProspectInteractionEntity({ id: 'i-1', prospectId: 'p-1', type: 'Call', summary: 'Old', author: 'Admin', date: new Date() });
    const updated = new ProspectInteractionEntity({ id: 'i-1', prospectId: 'p-1', type: 'Call', summary: 'Updated', author: 'Admin', date: new Date() });
    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    const command = new UpdateInteractionCommand('i-1', 'Call', 'Updated');
    const result = await handler.execute(command);

    expect(result).toBe(updated);
    expect(repository.update).toHaveBeenCalledWith('i-1', {
      type: 'Call',
      summary: 'Updated',
      author: 'Admin',
    });
  });
});
