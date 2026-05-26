import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IEvaluationResultRepository } from '../../../../domain/repositories/evaluation-result.repository.interface';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { EvaluationResultEntity } from '../../../../domain/entities/evaluation-result.entity';
import { EvaluationStatus } from '@prisma/client';
import { ProspectAlreadyApprovedException } from '../../../../domain/exceptions/admission-domain.exceptions';

export class SaveEvaluationCommand implements ICommand {
  constructor(
    public readonly prospectId: string,
    public readonly aptitude: EvaluationStatus,
    public readonly comments?: string,
  ) {}
}

@CommandHandler(SaveEvaluationCommand)
export class SaveEvaluationCommandHandler implements ICommandHandler<SaveEvaluationCommand> {
  constructor(
    @Inject('IEvaluationResultRepository')
    private readonly repository: IEvaluationResultRepository,
    @Inject('IProspectRepository')
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(
    command: SaveEvaluationCommand,
  ): Promise<EvaluationResultEntity> {
    // 1. Verificar si el postulante (prospect) existe en la base de datos
    // Se utiliza el repositorio de postulantes para buscarlo por su ID único.
    const prospect = await this.prospectRepository.findById(command.prospectId);
    if (!prospect) {
      // Si no existe, lanzamos una excepción HTTP 404 (Not Found) para detener el flujo
      throw new NotFoundException('Prospect not found');
    }

    // 2. Verificar si ya existe una evaluación previa para este postulante
    // En el CRM, un postulante puede tener solo una evaluación final (relación 1-a-1).
    const existing = await this.repository.findByProspectId(command.prospectId);
    if (existing) {
      // Si el postulante ya tiene dictamen final de APTO (FIT), impedimos cualquier cambio
      if (existing.aptitude === EvaluationStatus.FIT) {
        throw new ProspectAlreadyApprovedException(command.prospectId);
      }

      // 3. Caso de actualización (UPDATE):
      // Si la evaluación ya existe en la base de datos, actualizamos el dictamen 
      // (aptitude: FIT/UNFIT/PENDING) y los comentarios u observaciones.
      return this.repository.update(command.prospectId, {
        aptitude: command.aptitude,
        comments: command.comments,
      });
    } else {
      // 4. Caso de creación (CREATE):
      // Si es la primera vez que se evalúa al postulante, se crea un nuevo 
      // registro de evaluación asociado a su ID de prospecto.
      return this.repository.create({
        prospectId: command.prospectId,
        aptitude: command.aptitude,
        comments: command.comments,
      });
    }
  }
}
