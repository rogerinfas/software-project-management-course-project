import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IPaymentRepository } from '../../../../domain/repositories/payment.repository.interface';
import { IChargeRepository } from '../../../../domain/repositories/charge.repository.interface';
import { PaymentEntity } from '../../../../domain/entities/payment.entity';
import {
  ChargeNotFoundException,
  InvalidPaymentAmountException,
} from '../../../../domain/exceptions/treasury-domain.exceptions';
import { PaymentMethod } from '@prisma/client';

export class RegisterPaymentCommand implements ICommand {
  constructor(
    public readonly chargeId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
  ) {}
}

@CommandHandler(RegisterPaymentCommand)
export class RegisterPaymentCommandHandler implements ICommandHandler<RegisterPaymentCommand> {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    @Inject('IChargeRepository')
    private readonly chargeRepository: IChargeRepository,
  ) {}

  async execute(command: RegisterPaymentCommand): Promise<PaymentEntity> {
    const charge = await this.chargeRepository.findById(command.chargeId);
    if (!charge) {
      throw new ChargeNotFoundException(command.chargeId);
    }

    if (command.amount <= 0) {
      throw new InvalidPaymentAmountException('El monto de pago debe ser mayor que cero');
    }

    if (command.amount > charge.pendingAmount) {
      throw new InvalidPaymentAmountException(
        `El monto ingresado ($${command.amount}) supera el saldo pendiente ($${charge.pendingAmount})`,
      );
    }

    const newPending = Number((charge.pendingAmount - command.amount).toFixed(2));
    const newStatus = newPending === 0 ? 'PAID' : 'PARTIAL';

    // Actualizar el cargo
    await this.chargeRepository.update(charge.id, {
      pendingAmount: newPending,
      status: newStatus,
    });

    // Registrar el pago
    return this.paymentRepository.create({
      chargeId: charge.id,
      studentId: charge.studentId,
      totalAmount: command.amount,
      method: command.method,
      timestamp: new Date(),
    });
  }
}
