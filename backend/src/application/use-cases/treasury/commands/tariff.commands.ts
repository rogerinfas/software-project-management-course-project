import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ITariffRepository } from '../../../../domain/repositories/tariff.repository.interface';
import { TariffEntity } from '../../../../domain/entities/tariff.entity';
import { TariffNotFoundException } from '../../../../domain/exceptions/treasury-domain.exceptions';
import { TariffType, EducationalLevel } from '@prisma/client';

export class CreateTariffCommand implements ICommand {
  constructor(
    public readonly concept: string,
    public readonly amount: number,
    public readonly type: TariffType,
    public readonly level: EducationalLevel,
  ) {}
}

@CommandHandler(CreateTariffCommand)
export class CreateTariffCommandHandler implements ICommandHandler<CreateTariffCommand> {
  constructor(
    @Inject('ITariffRepository')
    private readonly tariffRepository: ITariffRepository,
  ) {}

  async execute(command: CreateTariffCommand): Promise<TariffEntity> {
    return this.tariffRepository.create({
      concept: command.concept,
      amount: command.amount,
      type: command.type,
      level: command.level,
    });
  }
}

export class UpdateTariffCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly concept?: string,
    public readonly amount?: number,
    public readonly type?: TariffType,
    public readonly level?: EducationalLevel,
  ) {}
}

@CommandHandler(UpdateTariffCommand)
export class UpdateTariffCommandHandler implements ICommandHandler<UpdateTariffCommand> {
  constructor(
    @Inject('ITariffRepository')
    private readonly tariffRepository: ITariffRepository,
  ) {}

  async execute(command: UpdateTariffCommand): Promise<TariffEntity> {
    const tariff = await this.tariffRepository.findById(command.id);
    if (!tariff) {
      throw new TariffNotFoundException(command.id);
    }
    return this.tariffRepository.update(command.id, {
      concept: command.concept,
      amount: command.amount,
      type: command.type,
      level: command.level,
    });
  }
}

export class DeleteTariffCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteTariffCommand)
export class DeleteTariffCommandHandler implements ICommandHandler<DeleteTariffCommand> {
  constructor(
    @Inject('ITariffRepository')
    private readonly tariffRepository: ITariffRepository,
  ) {}

  async execute(command: DeleteTariffCommand): Promise<void> {
    const tariff = await this.tariffRepository.findById(command.id);
    if (!tariff) {
      throw new TariffNotFoundException(command.id);
    }
    await this.tariffRepository.delete(command.id);
  }
}
