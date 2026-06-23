import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import {
  EducationalLevel,
  ProspectPriority,
  ProspectStage,
} from '@prisma/client';

export class CreateProspectCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly phone: string,
    public readonly targetGrade: string,
    public readonly level: EducationalLevel,
    public readonly priority: ProspectPriority,
  ) {}
}

@CommandHandler(CreateProspectCommand)
export class CreateProspectCommandHandler implements ICommandHandler<CreateProspectCommand> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly repository: IProspectRepository,
  ) {}

  async execute(command: CreateProspectCommand): Promise<ProspectEntity> {
    // 2. Crear y persistir el nuevo prospecto (postulante) en el repositorio
    return this.repository.create({
      name: command.name,
      phone: command.phone,
      targetGrade: command.targetGrade,
      level: command.level,
      priority: command.priority,
      stage: ProspectStage.ENTREVISTA,
    });
  }
}
