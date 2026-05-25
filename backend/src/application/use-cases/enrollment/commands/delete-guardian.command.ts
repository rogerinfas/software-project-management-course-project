import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { GuardianNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

export class DeleteGuardianCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteGuardianCommand)
export class DeleteGuardianCommandHandler
  implements ICommandHandler<DeleteGuardianCommand>
{
  constructor(
    @Inject('IGuardianRepository')
    private readonly repository: IGuardianRepository,
  ) {}

  async execute(command: DeleteGuardianCommand): Promise<GuardianEntity> {
    const existing = await this.repository.findById(command.id);
    if (!existing) {
      throw new GuardianNotFoundException(command.id);
    }

    return this.repository.delete(command.id);
  }
}
