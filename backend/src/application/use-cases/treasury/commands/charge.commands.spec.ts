import {
  CreateChargeCommand,
  CreateChargeCommandHandler,
  GenerateBulkChargesCommand,
  GenerateBulkChargesCommandHandler,
  DeleteChargeCommand,
  DeleteChargeCommandHandler,
} from './charge.commands';
import { ChargeEntity } from '../../../../domain/entities/charge.entity';
import { TariffNotFoundException, ChargeNotFoundException } from '../../../../domain/exceptions/treasury-domain.exceptions';
import { EducationalLevel, TariffType } from '@prisma/client';

describe('Charge Commands', () => {
  let chargeRepository: any;
  let tariffRepository: any;
  let prisma: any;

  beforeEach(() => {
    chargeRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };
    tariffRepository = {
      findById: jest.fn(),
    };
    prisma = {
      student: { findMany: jest.fn() },
      charge: { findFirst: jest.fn() },
    };
  });

  describe('CreateChargeCommandHandler', () => {
    it('should throw TariffNotFoundException if tariff not found', async () => {
      tariffRepository.findById.mockResolvedValue(null);
      const handler = new CreateChargeCommandHandler(chargeRepository, tariffRepository);
      const command = new CreateChargeCommand('stud-1', 'tariff-1');

      await expect(handler.execute(command)).rejects.toThrow(TariffNotFoundException);
    });

    it('should create charge successfully if tariff exists', async () => {
      tariffRepository.findById.mockResolvedValue({ id: 'tariff-1', amount: 100.0 });
      const created = new ChargeEntity({ id: 'ch-1', studentId: 'stud-1', tariffId: 'tariff-1', originalAmount: 100.0, pendingAmount: 100.0, dueDate: new Date(), status: 'PENDING' });
      chargeRepository.create.mockResolvedValue(created);

      const handler = new CreateChargeCommandHandler(chargeRepository, tariffRepository);
      const command = new CreateChargeCommand('stud-1', 'tariff-1');
      const result = await handler.execute(command);

      expect(result).toBe(created);
    });
  });

  describe('GenerateBulkChargesCommandHandler', () => {
    it('should throw TariffNotFoundException if tariff not found', async () => {
      tariffRepository.findById.mockResolvedValue(null);
      const handler = new GenerateBulkChargesCommandHandler(prisma, chargeRepository, tariffRepository);
      const command = new GenerateBulkChargesCommand('tariff-1');

      await expect(handler.execute(command)).rejects.toThrow(TariffNotFoundException);
    });

    it('should generate bulk charges for students without existing charges', async () => {
      tariffRepository.findById.mockResolvedValue({ id: 'tariff-1', amount: 100.0, level: EducationalLevel.PRIMARY });
      prisma.student.findMany.mockResolvedValue([{ id: 'stud-1' }, { id: 'stud-2' }]);
      prisma.charge.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({}); // stud-1 has no charge, stud-2 has one

      const handler = new GenerateBulkChargesCommandHandler(prisma, chargeRepository, tariffRepository);
      const command = new GenerateBulkChargesCommand('tariff-1');
      const result = await handler.execute(command);

      expect(result).toBe(1); // 1 charge created
      expect(chargeRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('DeleteChargeCommandHandler', () => {
    it('should throw ChargeNotFoundException if charge not found', async () => {
      chargeRepository.findById.mockResolvedValue(null);
      const handler = new DeleteChargeCommandHandler(chargeRepository);
      const command = new DeleteChargeCommand('ch-1');

      await expect(handler.execute(command)).rejects.toThrow(ChargeNotFoundException);
    });

    it('should delete charge if found', async () => {
      chargeRepository.findById.mockResolvedValue({});
      const handler = new DeleteChargeCommandHandler(chargeRepository);
      const command = new DeleteChargeCommand('ch-1');
      await handler.execute(command);

      expect(chargeRepository.delete).toHaveBeenCalledWith('ch-1');
    });
  });
});
