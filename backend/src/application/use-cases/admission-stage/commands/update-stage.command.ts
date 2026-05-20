import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

export class UpdateStageCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly order?: number,
  ) {}
}

@CommandHandler(UpdateStageCommand)
export class UpdateStageCommandHandler implements ICommandHandler<UpdateStageCommand> {
  constructor(
    @Inject('IAdmissionStageRepository')
    private readonly repository: IAdmissionStageRepository,
  ) {}

  async execute(command: UpdateStageCommand): Promise<AdmissionStageEntity> {
    // 1. Extraer el ID y los campos opcionales a actualizar del comando
    const { id, name, order } = command;

    // 2. Verificar si la etapa de admisión existe en la base de datos
    const stage = await this.repository.findById(id);
    if (!stage) {
      // Si no existe, lanzar excepción HTTP 404
      throw new NotFoundException('Stage not found');
    }

    // 3. Ejecutar la actualización en el repositorio
    // Si no se proporcionaron 'name' o 'order', se conservan los valores existentes.
    return this.repository.update(id, {
      name: name ?? stage.name,
      order: order ?? stage.order,
    });
  }
}
