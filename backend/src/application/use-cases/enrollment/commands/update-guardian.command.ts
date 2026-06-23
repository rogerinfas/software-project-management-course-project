import { GUARDIAN_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { STAFF_PROFILE_REPOSITORY } from '../../../../config/constants/tokens';
import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { SCHEDULE_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_REPOSITORY } from '../../../../config/constants/tokens';
import { PAYMENT_REPOSITORY } from '../../../../config/constants/tokens';
import { PROSPECT_INTERACTION_REPOSITORY } from '../../../../config/constants/tokens';
import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { GuardianNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

export class UpdateGuardianCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dni?: string,
    public readonly name?: string,
    public readonly phone?: string,
    public readonly email?: string | null,
    public readonly occupation?: string | null,
  ) {}
}

@CommandHandler(UpdateGuardianCommand)
export class UpdateGuardianCommandHandler implements ICommandHandler<UpdateGuardianCommand> {
  constructor(
    @Inject(GUARDIAN_REPOSITORY)
    private readonly repository: IGuardianRepository,
  ) {}

  async execute(command: UpdateGuardianCommand): Promise<GuardianEntity> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new GuardianNotFoundException(command.id);
    }

    return this.repository.update(command.id, {
      dni: command.dni,
      name: command.name,
      phone: command.phone,
      email: command.email,
      occupation: command.occupation,
    });
  }
}
