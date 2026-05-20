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
    const { id, name, order } = command;
    const stage = await this.repository.findById(id);
    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    return this.repository.update(id, {
      name: name ?? stage.name,
      order: order ?? stage.order,
    });
  }
}
