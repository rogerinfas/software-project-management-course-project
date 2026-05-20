import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { IAdmissionStageRepository } from '../../../../domain/repositories/admission-stage.repository.interface';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';

export class UpdateProspectStageCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly currentStageId: string,
  ) {}
}

@CommandHandler(UpdateProspectStageCommand)
export class UpdateProspectStageCommandHandler implements ICommandHandler<UpdateProspectStageCommand> {
  constructor(
    @Inject('IProspectRepository')
    private readonly repository: IProspectRepository,
    @Inject('IAdmissionStageRepository')
    private readonly stageRepository: IAdmissionStageRepository,
  ) {}

  async execute(command: UpdateProspectStageCommand): Promise<ProspectEntity> {
    const prospect = await this.repository.findById(command.id);
    if (!prospect) {
      throw new NotFoundException('Prospect not found');
    }

    const stage = await this.stageRepository.findById(command.currentStageId);
    if (!stage) {
      throw new NotFoundException('Target stage not found');
    }

    return this.repository.update(command.id, {
      currentStageId: command.currentStageId,
    });
  }
}
