import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IChargeRepository } from '../../../../domain/repositories/charge.repository.interface';
import { ITariffRepository } from '../../../../domain/repositories/tariff.repository.interface';
import { ChargeEntity } from '../../../../domain/entities/charge.entity';
import { ChargeNotFoundException, TariffNotFoundException } from '../../../../domain/exceptions/treasury-domain.exceptions';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';

export class CreateChargeCommand implements ICommand {
  constructor(
    public readonly studentId: string,
    public readonly tariffId: string,
    public readonly dueDate?: Date,
  ) {}
}

@CommandHandler(CreateChargeCommand)
export class CreateChargeCommandHandler implements ICommandHandler<CreateChargeCommand> {
  constructor(
    @Inject('IChargeRepository')
    private readonly chargeRepository: IChargeRepository,
    @Inject('ITariffRepository')
    private readonly tariffRepository: ITariffRepository,
  ) {}

  async execute(command: CreateChargeCommand): Promise<ChargeEntity> {
    const tariff = await this.tariffRepository.findById(command.tariffId);
    if (!tariff) {
      throw new TariffNotFoundException(command.tariffId);
    }
    return this.chargeRepository.create({
      studentId: command.studentId,
      tariffId: command.tariffId,
      originalAmount: tariff.amount,
      pendingAmount: tariff.amount,
      dueDate: command.dueDate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
      status: 'PENDING',
    });
  }
}

export class GenerateBulkChargesCommand implements ICommand {
  constructor(
    public readonly tariffId: string,
    public readonly dueDate?: Date,
  ) {}
}

@CommandHandler(GenerateBulkChargesCommand)
export class GenerateBulkChargesCommandHandler implements ICommandHandler<GenerateBulkChargesCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IChargeRepository')
    private readonly chargeRepository: IChargeRepository,
    @Inject('ITariffRepository')
    private readonly tariffRepository: ITariffRepository,
  ) {}

  async execute(command: GenerateBulkChargesCommand): Promise<number> {
    const tariff = await this.tariffRepository.findById(command.tariffId);
    if (!tariff) {
      throw new TariffNotFoundException(command.tariffId);
    }

    // Buscar todos los estudiantes del nivel de la tarifa
    const students = await this.prisma.student.findMany({
      where: {
        level: tariff.level,
      },
    });

    let count = 0;
    const dueDate = command.dueDate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5);

    for (const student of students) {
      // Evitar cargos duplicados para el mismo concepto y mes si ya existe uno pendiente/pagado con esta tarifa en el mismo mes de vencimiento
      const existing = await this.prisma.charge.findFirst({
        where: {
          studentId: student.id,
          tariffId: tariff.id,
          dueDate: {
            gte: new Date(dueDate.getFullYear(), dueDate.getMonth(), 1),
            lte: new Date(dueDate.getFullYear(), dueDate.getMonth(), 31),
          },
        },
      });

      if (!existing) {
        await this.chargeRepository.create({
          studentId: student.id,
          tariffId: tariff.id,
          originalAmount: tariff.amount,
          pendingAmount: tariff.amount,
          dueDate,
          status: 'PENDING',
        });
        count++;
      }
    }

    return count;
  }
}

export class DeleteChargeCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteChargeCommand)
export class DeleteChargeCommandHandler implements ICommandHandler<DeleteChargeCommand> {
  constructor(
    @Inject('IChargeRepository')
    private readonly chargeRepository: IChargeRepository,
  ) {}

  async execute(command: DeleteChargeCommand): Promise<void> {
    const charge = await this.chargeRepository.findById(command.id);
    if (!charge) {
      throw new ChargeNotFoundException(command.id);
    }
    await this.chargeRepository.delete(command.id);
  }
}
