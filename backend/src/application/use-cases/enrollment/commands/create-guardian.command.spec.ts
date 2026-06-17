import { CreateGuardianCommand, CreateGuardianCommandHandler } from './create-guardian.command';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { GuardianAlreadyExistsException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

describe('CreateGuardianCommandHandler', () => {
  let handler: CreateGuardianCommandHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findByDni: jest.fn(),
      create: jest.fn(),
    };
    handler = new CreateGuardianCommandHandler(repository);
  });

  it('should throw GuardianAlreadyExistsException if guardian exists', async () => {
    repository.findByDni.mockResolvedValue({});
    const command = new CreateGuardianCommand('12345678', 'Guardian', '987654321');

    await expect(handler.execute(command)).rejects.toThrow(GuardianAlreadyExistsException);
  });

  it('should create guardian successfully if not exists', async () => {
    repository.findByDni.mockResolvedValue(null);
    const created = new GuardianEntity({ id: 'g-1', dni: '12345678', name: 'Guardian', phone: '987654321' });
    repository.create.mockResolvedValue(created);

    const command = new CreateGuardianCommand('12345678', 'Guardian', '987654321');
    const result = await handler.execute(command);

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith({
      dni: '12345678',
      name: 'Guardian',
      phone: '987654321',
      email: undefined,
      occupation: undefined,
    });
  });
});
