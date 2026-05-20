import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

export class CreateStageCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly order: number,
  ) {}
}

@CommandHandler(CreateStageCommand)
export class CreateStageCommandHandler implements ICommandHandler<CreateStageCommand> {
  constructor(
    @Inject('IAdmissionStageRepository')
    private readonly repository: IAdmissionStageRepository,
  ) {}

  async execute(command: CreateStageCommand): Promise<AdmissionStageEntity> {
    const { name, order } = command;
    return this.repository.create({ name, order });
  }
}
