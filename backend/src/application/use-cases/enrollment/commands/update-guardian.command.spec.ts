import { UpdateGuardianCommand, UpdateGuardianCommandHandler } from './update-guardian.command';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { GuardianNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

describe('UpdateGuardianCommandHandler', () => {
  let handler: UpdateGuardianCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    handler = new UpdateGuardianCommandHandler(repository);
  });

  it('should throw GuardianNotFoundException if guardian not found', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new UpdateGuardianCommand('g-1', '12345678');

    await expect(handler.execute(command)).rejects.toThrow(GuardianNotFoundException);
  });

  it('should update guardian successfully if found', async () => {
    const existing = new GuardianEntity({ id: 'g-1', dni: '12345678', name: 'Old Name', phone: '987654321' });
    const updated = new GuardianEntity({ id: 'g-1', dni: '12345678', name: 'New Name', phone: '987654321' });
    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    const command = new UpdateGuardianCommand('g-1', '12345678', 'New Name');
    const result = await handler.execute(command);

    expect(result).toBe(updated);
    expect(repository.update).toHaveBeenCalledWith('g-1', {
      dni: '12345678',
      name: 'New Name',
      phone: undefined,
      email: undefined,
      occupation: undefined,
    });
  });
});
