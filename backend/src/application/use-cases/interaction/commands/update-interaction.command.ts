import { PROSPECT_INTERACTION_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { PAYMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IProspectInteractionRepository } from '../../../../domain/repositories/interaction.repository.interface';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';

export class UpdateInteractionCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly summary: string,
    public readonly author?: string,
  ) {}
}

@CommandHandler(UpdateInteractionCommand)
export class UpdateInteractionCommandHandler implements ICommandHandler<UpdateInteractionCommand> {
  constructor(
    @Inject(PROSPECT_INTERACTION_REPOSITORY)
    private readonly repository: IProspectInteractionRepository,
  ) {}

  async execute(
    command: UpdateInteractionCommand,
  ): Promise<ProspectInteractionEntity> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new NotFoundException('Interaction not found');
    }

    return this.repository.update(command.id, {
      type: command.type,
      summary: command.summary,
      author: command.author || existing.author,
    });
  }
}
