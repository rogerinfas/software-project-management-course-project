import { DeleteGuardianCommand, DeleteGuardianCommandHandler } from './delete-guardian.command';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { GuardianNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

describe('DeleteGuardianCommandHandler', () => {
  let handler: DeleteGuardianCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };
    handler = new DeleteGuardianCommandHandler(repository);
  });

  it('should throw GuardianNotFoundException if guardian not found', async () => {
    repository.findById.mockResolvedValue(null);
    const command = new DeleteGuardianCommand('g-1');

    await expect(handler.execute(command)).rejects.toThrow(GuardianNotFoundException);
  });

  it('should delete guardian successfully if found', async () => {
    const existing = new GuardianEntity({ id: 'g-1', dni: '12345678', name: 'Guardian', phone: '987654321' });
    repository.findById.mockResolvedValue(existing);
    repository.delete.mockResolvedValue(existing);

    const command = new DeleteGuardianCommand('g-1');
    const result = await handler.execute(command);

    expect(result).toBe(existing);
    expect(repository.delete).toHaveBeenCalledWith('g-1');
  });
});
