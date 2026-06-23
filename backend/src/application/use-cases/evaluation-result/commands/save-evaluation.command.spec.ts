import {
  SaveEvaluationCommand,
  SaveEvaluationCommandHandler,
} from './save-evaluation.command';
import { EvaluationResultEntity } from '../../../../domain/entities/evaluation-result.entity';
import { EvaluationStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { ProspectAlreadyApprovedException } from '../../../../domain/exceptions/admission-domain.exceptions';

describe('SaveEvaluationCommandHandler', () => {
  let handler: SaveEvaluationCommandHandler;
  let repository: any;
  let prospectRepository: any;

  beforeEach(() => {
    repository = {
      findByProspectId: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };
    prospectRepository = {
      findById: jest.fn(),
    };
    handler = new SaveEvaluationCommandHandler(repository, prospectRepository);
  });

  it('should throw NotFoundException if prospect not found', async () => {
    prospectRepository.findById.mockResolvedValue(null);
    const command = new SaveEvaluationCommand('p-1', EvaluationStatus.FIT);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw ProspectAlreadyApprovedException if evaluation exists and is already FIT', async () => {
    prospectRepository.findById.mockResolvedValue({});
    const existing = new EvaluationResultEntity({
      id: 'e-1',
      prospectId: 'p-1',
      aptitude: EvaluationStatus.FIT,
    });
    repository.findByProspectId.mockResolvedValue(existing);

    const command = new SaveEvaluationCommand('p-1', EvaluationStatus.UNFIT);

    await expect(handler.execute(command)).rejects.toThrow(
      ProspectAlreadyApprovedException,
    );
  });

  it('should update evaluation if it exists and is not FIT', async () => {
    prospectRepository.findById.mockResolvedValue({});
    const existing = new EvaluationResultEntity({
      id: 'e-1',
      prospectId: 'p-1',
      aptitude: EvaluationStatus.PENDING,
    });
    repository.findByProspectId.mockResolvedValue(existing);

    const updated = new EvaluationResultEntity({
      id: 'e-1',
      prospectId: 'p-1',
      aptitude: EvaluationStatus.FIT,
      comments: 'Now fit',
    });
    repository.update.mockResolvedValue(updated);

    const command = new SaveEvaluationCommand(
      'p-1',
      EvaluationStatus.FIT,
      'Now fit',
    );
    const result = await handler.execute(command);

    expect(result).toBe(updated);
    expect(repository.update).toHaveBeenCalledWith('p-1', {
      aptitude: EvaluationStatus.FIT,
      comments: 'Now fit',
    });
  });

  it('should create evaluation if none exists', async () => {
    prospectRepository.findById.mockResolvedValue({});
    repository.findByProspectId.mockResolvedValue(null);

    const created = new EvaluationResultEntity({
      id: 'e-1',
      prospectId: 'p-1',
      aptitude: EvaluationStatus.FIT,
      comments: 'Good',
    });
    repository.create.mockResolvedValue(created);

    const command = new SaveEvaluationCommand(
      'p-1',
      EvaluationStatus.FIT,
      'Good',
    );
    const result = await handler.execute(command);

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith({
      prospectId: 'p-1',
      aptitude: EvaluationStatus.FIT,
      comments: 'Good',
    });
  });
});
