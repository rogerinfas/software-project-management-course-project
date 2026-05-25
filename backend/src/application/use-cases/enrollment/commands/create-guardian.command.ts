import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IGuardianRepository } from '../../../../domain/repositories/guardian.repository.interface';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';
import { GuardianAlreadyExistsException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

export class CreateGuardianCommand implements ICommand {
  constructor(
    public readonly dni: string,
    public readonly name: string,
    public readonly phone: string,
    public readonly email?: string | null,
    public readonly occupation?: string | null,
  ) {}
}

@CommandHandler(CreateGuardianCommand)
export class CreateGuardianCommandHandler
  implements ICommandHandler<CreateGuardianCommand>
{
  constructor(
    @Inject('IGuardianRepository')
    private readonly repository: IGuardianRepository,
  ) {}

  async execute(command: CreateGuardianCommand): Promise<GuardianEntity> {
    const existing = await this.repository.findByDni(command.dni);
    if (existing) {
      throw new GuardianAlreadyExistsException(command.dni);
    }

    return this.repository.create({
      dni: command.dni,
      name: command.name,
      phone: command.phone,
      email: command.email,
      occupation: command.occupation,
    });
  }
}
