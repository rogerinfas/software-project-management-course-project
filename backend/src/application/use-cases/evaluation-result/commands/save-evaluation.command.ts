import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IEvaluationResultRepository } from '../../../../domain/repositories/evaluation-result.repository.interface';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { EvaluationResultEntity } from '../../../../domain/entities/evaluation-result.entity';
import { EvaluationStatus } from '@prisma/client';

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
    const prospect = await this.prospectRepository.findById(command.prospectId);
    if (!prospect) {
      throw new NotFoundException('Prospect not found');
    }

    const existing = await this.repository.findByProspectId(command.prospectId);
    if (existing) {
      return this.repository.update(command.prospectId, {
        aptitude: command.aptitude,
        comments: command.comments,
      });
    } else {
      return this.repository.create({
        prospectId: command.prospectId,
        aptitude: command.aptitude,
        comments: command.comments,
      });
    }
  }
}
