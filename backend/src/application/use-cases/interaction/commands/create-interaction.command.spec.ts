import {
  CreateInteractionCommand,
  CreateInteractionCommandHandler,
} from './create-interaction.command';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateInteractionCommandHandler', () => {
  let handler: CreateInteractionCommandHandler;
  let repository: any;
  let prospectRepository: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };
    prospectRepository = {
      findById: jest.fn(),
    };
    handler = new CreateInteractionCommandHandler(
      repository,
      prospectRepository,
    );
  });

  it('should throw NotFoundException if prospect not found', async () => {
    prospectRepository.findById.mockResolvedValue(null);
    const command = new CreateInteractionCommand(
      'p-1',
      'Call',
      'Called prospect',
      'Admin',
    );

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should create interaction successfully if prospect exists', async () => {
    prospectRepository.findById.mockResolvedValue({});
    const created = new ProspectInteractionEntity({
      id: 'i-1',
      prospectId: 'p-1',
      type: 'Call',
      summary: 'Called',
      author: 'Admin',
      date: new Date(),
    });
    repository.create.mockResolvedValue(created);

    const command = new CreateInteractionCommand(
      'p-1',
      'Call',
      'Called',
      'Admin',
    );
    const result = await handler.execute(command);

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        prospectId: 'p-1',
        type: 'Call',
        summary: 'Called',
        author: 'Admin',
        date: expect.any(Date),
      }),
    );
  });
});
