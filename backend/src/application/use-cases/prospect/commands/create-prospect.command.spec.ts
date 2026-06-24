import {
  CreateProspectCommand,
  CreateProspectCommandHandler,
} from './create-prospect.command';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { EducationalLevel, ProspectPriority, ProspectStage } from '@prisma/client';

describe('CreateProspectCommandHandler', () => {
  let handler: CreateProspectCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };
    handler = new CreateProspectCommandHandler(repository);
  });

  it('should create prospect successfully', async () => {
    const created = new ProspectEntity({
      id: 'p-1',
      name: 'John Doe',
      phone: '123456789',
      targetGrade: '1',
      level: EducationalLevel.PRIMARY,
      priority: ProspectPriority.HIGH,
      stage: ProspectStage.ENTREVISTA,
    });
    repository.create.mockResolvedValue(created);

    const command = new CreateProspectCommand(
      'John Doe',
      '123456789',
      '1',
      EducationalLevel.PRIMARY,
      ProspectPriority.HIGH,
    );
    const result = await handler.execute(command);

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'John Doe',
      phone: '123456789',
      targetGrade: '1',
      level: EducationalLevel.PRIMARY,
      priority: ProspectPriority.HIGH,
      stage: ProspectStage.ENTREVISTA,
    });
  });
});
