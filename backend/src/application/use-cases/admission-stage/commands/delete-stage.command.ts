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
    const stage = await this.repository.findById(command.id);
    if (!stage) {
      throw new NotFoundException('Stage not found');
    }
    await this.repository.delete(command.id);
  }
}
