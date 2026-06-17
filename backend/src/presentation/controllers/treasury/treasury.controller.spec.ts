import { Test, TestingModule } from '@nestjs/testing';
import { TreasuryController } from './treasury.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TariffEntity } from '../../../domain/entities/tariff.entity';
import { ChargeEntity } from '../../../domain/entities/charge.entity';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { TariffType, EducationalLevel, PaymentMethod } from '@prisma/client';

describe('TreasuryController (Unit)', () => {
  let controller: TreasuryController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreasuryController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TreasuryController>(TreasuryController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('tariffs', () => {
    it('should return all tariffs', async () => {
      const tariff = new TariffEntity({ id: 't-1', concept: 'Concept', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });
      queryBus.execute.mockResolvedValue([tariff]);

      const result = await controller.getTariffs();

      expect(result).toEqual([tariff.toDto()]);
    });

    it('should create tariff', async () => {
      const tariff = new TariffEntity({ id: 't-1', concept: 'Concept', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });
      commandBus.execute.mockResolvedValue(tariff);

      const result = await controller.createTariff({ concept: 'Concept', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });

      expect(result).toEqual(tariff.toDto());
    });

    it('should update tariff', async () => {
      const tariff = new TariffEntity({ id: 't-1', concept: 'New Concept', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });
      commandBus.execute.mockResolvedValue(tariff);

      const result = await controller.updateTariff('t-1', { concept: 'New Concept' });

      expect(result).toEqual(tariff.toDto());
    });

    it('should delete tariff', async () => {
      commandBus.execute.mockResolvedValue(undefined);

      await controller.deleteTariff('t-1');

      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('charges', () => {
    it('should return all charges', async () => {
      const charge = new ChargeEntity({ id: 'ch-1', studentId: 'stud-1', tariffId: 'tariff-1', originalAmount: 100.0, pendingAmount: 100.0, dueDate: new Date(), status: 'PENDING' });
      queryBus.execute.mockResolvedValue([charge]);

      const result = await controller.getCharges('stud-1', 'PENDING');

      expect(result).toEqual([charge.toDto()]);
    });

    it('should create charge', async () => {
      const charge = new ChargeEntity({ id: 'ch-1', studentId: 'stud-1', tariffId: 'tariff-1', originalAmount: 100.0, pendingAmount: 100.0, dueDate: new Date(), status: 'PENDING' });
      commandBus.execute.mockResolvedValue(charge);

      const result = await controller.createCharge({ studentId: 'stud-1', tariffId: 'tariff-1' });

      expect(result).toEqual(charge.toDto());
    });

    it('should generate bulk charges', async () => {
      commandBus.execute.mockResolvedValue(5);

      const result = await controller.generateBulkCharges({ tariffId: 'tariff-1' });

      expect(result).toEqual({ count: 5 });
    });

    it('should delete charge', async () => {
      commandBus.execute.mockResolvedValue(undefined);

      await controller.deleteCharge('ch-1');

      expect(commandBus.execute).toHaveBeenCalled();
    });
  });

  describe('payments', () => {
    it('should return all payments', async () => {
      const payment = new PaymentEntity({ id: 'p-1', chargeId: 'ch-1', studentId: 'stud-1', totalAmount: 100.0, method: PaymentMethod.CASH, timestamp: new Date() });
      queryBus.execute.mockResolvedValue([payment]);

      const result = await controller.getPayments('stud-1', 'ch-1');

      expect(result).toEqual([payment.toDto()]);
    });

    it('should register payment', async () => {
      const payment = new PaymentEntity({ id: 'p-1', chargeId: 'ch-1', studentId: 'stud-1', totalAmount: 100.0, method: PaymentMethod.CASH, timestamp: new Date() });
      commandBus.execute.mockResolvedValue(payment);

      const result = await controller.registerPayment({ chargeId: 'ch-1', amount: 100.0, method: PaymentMethod.CASH });

      expect(result).toEqual(payment.toDto());
    });
  });
});
