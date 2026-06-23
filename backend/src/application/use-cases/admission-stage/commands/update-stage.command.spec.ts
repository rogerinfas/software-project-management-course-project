import {
  UpdateStageCommand,
  UpdateStageCommandHandler,
} from './update-stage.command';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateStageCommandHandler', () => {
  let handler: UpdateStageCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    handler = new UpdateStageCommandHandler(repository);
  });

  it('should throw NotFoundException if stage not found', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new UpdateStageCommand('non-existent-id', 'New Name');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should update stage successfully if found', async () => {
    const stage = new AdmissionStageEntity({
      id: 's-1',
      name: 'Old Name',
      order: 1,
    });
    const updated = new AdmissionStageEntity({
      id: 's-1',
      name: 'New Name',
      order: 2,
    });
    repository.findById.mockResolvedValue(stage);
    repository.update.mockResolvedValue(updated);

    const command = new UpdateStageCommand('s-1', 'New Name', 2);
    const result = await handler.execute(command);

    expect(result).toBe(updated);
    expect(repository.update).toHaveBeenCalledWith('s-1', {
      name: 'New Name',
      order: 2,
    });
  });
});
