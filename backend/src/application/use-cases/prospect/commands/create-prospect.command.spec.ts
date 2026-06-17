import { CreateProspectCommand, CreateProspectCommandHandler } from './create-prospect.command';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { EducationalLevel, ProspectPriority } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('CreateProspectCommandHandler', () => {
  let handler: CreateProspectCommandHandler;
  let repository: any;
  let stageRepository: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };
    stageRepository = {
      findById: jest.fn(),
    };
    handler = new CreateProspectCommandHandler(repository, stageRepository);
  });

  it('should throw NotFoundException if stage not found', async () => {
    stageRepository.findById.mockResolvedValue(null);
    const command = new CreateProspectCommand('John Doe', '123456789', '1', EducationalLevel.PRIMARY, ProspectPriority.HIGH, 's-1');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should create prospect successfully if stage exists', async () => {
    stageRepository.findById.mockResolvedValue({});
    const created = new ProspectEntity({ id: 'p-1', name: 'John Doe', phone: '123456789', targetGrade: '1', level: EducationalLevel.PRIMARY, priority: ProspectPriority.HIGH, currentStageId: 's-1' });
    repository.create.mockResolvedValue(created);

    const command = new CreateProspectCommand('John Doe', '123456789', '1', EducationalLevel.PRIMARY, ProspectPriority.HIGH, 's-1');
    const result = await handler.execute(command);

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'John Doe',
      phone: '123456789',
      targetGrade: '1',
      level: EducationalLevel.PRIMARY,
      priority: ProspectPriority.HIGH,
      currentStageId: 's-1',
    });
  });
});
