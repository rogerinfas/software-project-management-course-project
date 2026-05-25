import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
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
export class UpdateGuardianCommandHandler
  implements ICommandHandler<UpdateGuardianCommand>
{
  constructor(
    @Inject('IGuardianRepository')
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
