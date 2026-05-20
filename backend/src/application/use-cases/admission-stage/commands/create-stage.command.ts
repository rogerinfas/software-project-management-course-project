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
    // 1. Extraer los datos necesarios (nombre de la etapa y orden secuencial) del comando
    const { name, order } = command;

    // 2. Persistir la nueva etapa de admisión en la base de datos a través del repositorio
    return this.repository.create({ name, order });
  }
}
