import {
  RegisterPaymentCommand,
  RegisterPaymentCommandHandler,
} from './payment.commands';
import { PaymentEntity } from '../../../../domain/entities/payment.entity';
import {
  ChargeNotFoundException,
  InvalidPaymentAmountException,
} from '../../../../domain/exceptions/treasury-domain.exceptions';
import { PaymentMethod } from '@prisma/client';

describe('Payment Commands', () => {
  let paymentRepository: any;
  let chargeRepository: any;

  beforeEach(() => {
    paymentRepository = {
      create: jest.fn(),
    };
    chargeRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
  });

  describe('RegisterPaymentCommandHandler', () => {
    it('should throw ChargeNotFoundException if charge not found', async () => {
      chargeRepository.findById.mockResolvedValue(null);
      const handler = new RegisterPaymentCommandHandler(
        paymentRepository,
        chargeRepository,
      );
      const command = new RegisterPaymentCommand(
        'ch-1',
        50.0,
        PaymentMethod.CASH,
      );

      await expect(handler.execute(command)).rejects.toThrow(
        ChargeNotFoundException,
      );
    });

    it('should throw InvalidPaymentAmountException if amount is negative or zero', async () => {
      chargeRepository.findById.mockResolvedValue({
        id: 'ch-1',
        pendingAmount: 100.0,
      });
      const handler = new RegisterPaymentCommandHandler(
        paymentRepository,
        chargeRepository,
      );
      const command = new RegisterPaymentCommand(
        'ch-1',
        -10.0,
        PaymentMethod.CASH,
      );

      await expect(handler.execute(command)).rejects.toThrow(
        InvalidPaymentAmountException,
      );
    });

    it('should throw InvalidPaymentAmountException if amount exceeds pending amount', async () => {
      chargeRepository.findById.mockResolvedValue({
        id: 'ch-1',
        pendingAmount: 100.0,
      });
      const handler = new RegisterPaymentCommandHandler(
        paymentRepository,
        chargeRepository,
      );
      const command = new RegisterPaymentCommand(
        'ch-1',
        120.0,
        PaymentMethod.CASH,
      );

      await expect(handler.execute(command)).rejects.toThrow(
        InvalidPaymentAmountException,
      );
    });

    it('should register payment and update charge status successfully', async () => {
      chargeRepository.findById.mockResolvedValue({
        id: 'ch-1',
        studentId: 'stud-1',
        pendingAmount: 100.0,
      });
      const createdPayment = new PaymentEntity({
        id: 'p-1',
        chargeId: 'ch-1',
        totalAmount: 100.0,
        method: PaymentMethod.CASH,
        timestamp: new Date(),
      });
      paymentRepository.create.mockResolvedValue(createdPayment);

      const handler = new RegisterPaymentCommandHandler(
        paymentRepository,
        chargeRepository,
      );
      const command = new RegisterPaymentCommand(
        'ch-1',
        100.0,
        PaymentMethod.CASH,
      );
      const result = await handler.execute(command);

      expect(result).toBe(createdPayment);
      expect(chargeRepository.update).toHaveBeenCalledWith('ch-1', {
        pendingAmount: 0.0,
        status: 'PAID',
      });
    });
  });
});
