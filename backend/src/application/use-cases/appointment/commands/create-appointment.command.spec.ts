import {
  CreateAppointmentCommand,
  CreateAppointmentCommandHandler,
} from './create-appointment.command';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateAppointmentCommandHandler', () => {
  let handler: CreateAppointmentCommandHandler;
  let repository: any;
  let prospectRepository: any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };
    prospectRepository = {
      findById: jest.fn(),
    };
    handler = new CreateAppointmentCommandHandler(
      repository,
      prospectRepository,
    );
  });

  it('should throw NotFoundException if prospect not found', async () => {
    prospectRepository.findById.mockResolvedValue(null);
    const command = new CreateAppointmentCommand(
      'p-1',
      new Date(),
      'Interview',
      'Notes',
    );

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should successfully create appointment if prospect exists', async () => {
    prospectRepository.findById.mockResolvedValue({});
    const date = new Date();
    const created = new AppointmentEntity({
      id: 'app-1',
      prospectId: 'p-1',
      date,
      type: 'Interview',
      notes: 'Notes',
    });
    repository.create.mockResolvedValue(created);

    const command = new CreateAppointmentCommand(
      'p-1',
      date,
      'Interview',
      'Notes',
    );
    const result = await handler.execute(command);

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith({
      prospectId: 'p-1',
      date,
      type: 'Interview',
      notes: 'Notes',
    });
  });
});
