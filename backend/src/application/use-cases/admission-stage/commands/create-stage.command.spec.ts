import {
  CreateStageCommand,
  CreateStageCommandHandler,
} from './create-stage.command';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

describe('CreateStageCommandHandler', () => {
  let handler: CreateStageCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };
    handler = new CreateStageCommandHandler(repository);
  });

  it('should successfully create admission stage', async () => {
    const created = new AdmissionStageEntity({
      id: 's-1',
      name: 'Stage 1',
      order: 1,
    });
    repository.create.mockResolvedValue(created);

    const command = new CreateStageCommand('Stage 1', 1);
    const result = await handler.execute(command);

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Stage 1',
      order: 1,
    });
  });
});
