import {
  UpdateProspectStageCommand,
  UpdateProspectStageCommandHandler,
} from './update-prospect-stage.command';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProspectStage } from '@prisma/client';

describe('UpdateProspectStageCommandHandler', () => {
  let handler: UpdateProspectStageCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    handler = new UpdateProspectStageCommandHandler(repository);
  });

  it('should throw NotFoundException if prospect not found', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new UpdateProspectStageCommand('p-1', ProspectStage.EVALUACION_PSICOLOGICA);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException if prospect is in EVALUACION_ACADEMICA', async () => {
    const prospect = new ProspectEntity({
      id: 'p-1',
      name: 'John Doe',
      stage: ProspectStage.EVALUACION_ACADEMICA,
    });
    repository.findById.mockResolvedValue(prospect);

    const command = new UpdateProspectStageCommand('p-1', ProspectStage.ENTREVISTA);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
  });

  it('should update stage successfully', async () => {
    const prospect = new ProspectEntity({
      id: 'p-1',
      name: 'John Doe',
      stage: ProspectStage.ENTREVISTA,
    });
    const updated = new ProspectEntity({
      id: 'p-1',
      name: 'John Doe',
      stage: ProspectStage.EVALUACION_PSICOLOGICA,
    });
    repository.findById.mockResolvedValue(prospect);
    repository.update.mockResolvedValue(updated);

    const command = new UpdateProspectStageCommand('p-1', ProspectStage.EVALUACION_PSICOLOGICA);
    const result = await handler.execute(command);

    expect(result).toBe(updated);
    expect(repository.update).toHaveBeenCalledWith('p-1', {
      stage: ProspectStage.EVALUACION_PSICOLOGICA,
    });
  });
});
