import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';

export class DeleteStageCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteStageCommand)
export class DeleteStageCommandHandler implements ICommandHandler<DeleteStageCommand> {
  constructor(
    @Inject('IAdmissionStageRepository')
    private readonly repository: IAdmissionStageRepository,
  ) {}

  async execute(command: DeleteStageCommand): Promise<void> {
    // 1. Buscar la etapa de admisión por su ID para verificar su existencia
    const stage = await this.repository.findById(command.id);
    if (!stage) {
      // Si la etapa no existe, lanzar excepción HTTP 404
      throw new NotFoundException('Stage not found');
    }

    // 2. Eliminar la etapa a través del repositorio
    await this.repository.delete(command.id);
  }
}
