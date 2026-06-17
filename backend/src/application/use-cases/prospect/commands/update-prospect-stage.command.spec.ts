import { UpdateProspectStageCommand, UpdateProspectStageCommandHandler } from './update-prospect-stage.command';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateProspectStageCommandHandler', () => {
  let handler: UpdateProspectStageCommandHandler;
  let repository: any;
  let stageRepository: any;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    stageRepository = {
      findById: jest.fn(),
    };
    handler = new UpdateProspectStageCommandHandler(repository, stageRepository);
  });

  it('should throw NotFoundException if prospect not found', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new UpdateProspectStageCommand('p-1', 's-2');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if target stage not found', async () => {
    repository.findById.mockResolvedValue({});
    stageRepository.findById.mockResolvedValue(null);
    const command = new UpdateProspectStageCommand('p-1', 's-2');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should update stage successfully if both exist', async () => {
    const prospect = new ProspectEntity({ id: 'p-1', name: 'John Doe', currentStageId: 's-1' });
    const updated = new ProspectEntity({ id: 'p-1', name: 'John Doe', currentStageId: 's-2' });
    repository.findById.mockResolvedValue(prospect);
    stageRepository.findById.mockResolvedValue({});
    repository.update.mockResolvedValue(updated);

    const command = new UpdateProspectStageCommand('p-1', 's-2');
    const result = await handler.execute(command);

    expect(result).toBe(updated);
    expect(repository.update).toHaveBeenCalledWith('p-1', { currentStageId: 's-2' });
  });
});
