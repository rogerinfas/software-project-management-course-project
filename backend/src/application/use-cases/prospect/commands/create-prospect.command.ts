import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import { EducationalLevel, ProspectPriority } from '@prisma/client';

export class CreateProspectCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly phone: string,
    public readonly targetGrade: string,
    public readonly level: EducationalLevel,
    public readonly priority: ProspectPriority,
    public readonly currentStageId: string,
  ) {}
}

@CommandHandler(CreateProspectCommand)
export class CreateProspectCommandHandler implements ICommandHandler<CreateProspectCommand> {
  constructor(
    @Inject('IProspectRepository')
    private readonly repository: IProspectRepository,
    @Inject('IAdmissionStageRepository')
    private readonly stageRepository: IAdmissionStageRepository,
  ) {}

  async execute(command: CreateProspectCommand): Promise<ProspectEntity> {
    const stage = await this.stageRepository.findById(command.currentStageId);
    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    return this.repository.create({
      name: command.name,
      phone: command.phone,
      targetGrade: command.targetGrade,
      level: command.level,
      priority: command.priority,
      currentStageId: command.currentStageId,
    });
  }
}
