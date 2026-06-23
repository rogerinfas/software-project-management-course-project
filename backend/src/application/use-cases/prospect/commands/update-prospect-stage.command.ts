import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import type { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { ProspectStage } from '@prisma/client';

export class UpdateProspectStageCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly stage: ProspectStage,
  ) {}
}

@CommandHandler(UpdateProspectStageCommand)
export class UpdateProspectStageCommandHandler implements ICommandHandler<UpdateProspectStageCommand> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly repository: IProspectRepository,
  ) {}

  async execute(command: UpdateProspectStageCommand): Promise<ProspectEntity> {
    // 1. Verificar si el postulante (prospect) existe en la base de datos
    const prospect = await this.repository.findById(command.id);
    if (!prospect) {
      throw new NotFoundException('Prospect not found');
    }

    // 2. REGLA DE NEGOCIO: No se puede retroceder desde EVALUACION_ACADEMICA
    if (prospect.stage === ProspectStage.EVALUACION_ACADEMICA) {
      throw new ConflictException(
        'El prospecto ya se encuentra en Evaluación Académica y no puede cambiar de etapa.',
      );
    }

    // 3. Actualizar la etapa actual del postulante en el repositorio
    return this.repository.update(command.id, {
      stage: command.stage,
    });
  }
}
