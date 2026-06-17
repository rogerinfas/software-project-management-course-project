import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { IProspectInteractionRepository } from '../../../../domain/repositories/interaction.repository.interface';
import { IProspectRepository } from '../../../../domain/repositories/prospect.repository.interface';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';

export class CreateInteractionCommand implements ICommand {
  constructor(
    public readonly prospectId: string,
    public readonly type: string,
    public readonly summary: string,
    public readonly author: string,
  ) {}
}

@CommandHandler(CreateInteractionCommand)
export class CreateInteractionCommandHandler
  implements ICommandHandler<CreateInteractionCommand>
{
  constructor(
    @Inject('IProspectInteractionRepository')
    private readonly repository: IProspectInteractionRepository,
    @Inject('IProspectRepository')
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async execute(
    command: CreateInteractionCommand,
  ): Promise<ProspectInteractionEntity> {
    const prospect = await this.prospectRepository.findById(command.prospectId);
    if (!prospect) {
      throw new NotFoundException('Prospect not found');
    }

    return this.repository.create({
      prospectId: command.prospectId,
      type: command.type,
      summary: command.summary,
      author: command.author,
      date: new Date(),
    });
  }
}
