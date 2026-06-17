import { DeleteStageCommand, DeleteStageCommandHandler } from './delete-stage.command';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteStageCommandHandler', () => {
  let handler: DeleteStageCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };
    handler = new DeleteStageCommandHandler(repository);
  });

  it('should throw NotFoundException if stage not found', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new DeleteStageCommand('non-existent-id');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should delete stage successfully if found', async () => {
    const stage = new AdmissionStageEntity({ id: 's-1', name: 'Stage 1', order: 1 });
    repository.findById.mockResolvedValue(stage);
    repository.delete.mockResolvedValue(undefined);

    const command = new DeleteStageCommand('s-1');
    await handler.execute(command);

    expect(repository.delete).toHaveBeenCalledWith('s-1');
  });
});
