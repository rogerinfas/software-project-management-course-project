import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';

export class CreateAppointmentCommand implements ICommand {
  constructor(
    public readonly prospectId: string,
    public readonly date: Date,
    public readonly type: string,
    public readonly notes?: string,
  ) {}
}

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentCommandHandler implements ICommandHandler<CreateAppointmentCommand> {
  constructor(
    @Inject('IAppointmentRepository')
    private readonly repository: IAppointmentRepository,
    @Inject('IProspectRepository')
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<AppointmentEntity> {
    const prospect = await this.prospectRepository.findById(command.prospectId);
    if (!prospect) {
      throw new NotFoundException('Prospect not found');
    }

    return this.repository.create({
      prospectId: command.prospectId,
      date: new Date(command.date),
      type: command.type,
      notes: command.notes,
    });
  }
}
