import {
  CreateTariffCommand,
  CreateTariffCommandHandler,
  UpdateTariffCommand,
  UpdateTariffCommandHandler,
  DeleteTariffCommand,
  DeleteTariffCommandHandler,
} from './tariff.commands';
import { TariffEntity } from '../../../../domain/entities/tariff.entity';
import { TariffNotFoundException } from '../../../../domain/exceptions/treasury-domain.exceptions';
import { TariffType, EducationalLevel } from '@prisma/client';

describe('Tariff Commands', () => {
  let tariffRepository: any;

  beforeEach(() => {
    tariffRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateTariffCommandHandler', () => {
    it('should create tariff successfully', async () => {
      const created = new TariffEntity({ id: 't-1', concept: 'Concept', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });
      tariffRepository.create.mockResolvedValue(created);

      const handler = new CreateTariffCommandHandler(tariffRepository);
      const command = new CreateTariffCommand('Concept', 100.0, TariffType.EXTRA, EducationalLevel.PRIMARY);
      const result = await handler.execute(command);

      expect(result).toBe(created);
    });
  });

  describe('UpdateTariffCommandHandler', () => {
    it('should throw TariffNotFoundException if tariff not found', async () => {
      tariffRepository.findById.mockResolvedValue(null);
      const handler = new UpdateTariffCommandHandler(tariffRepository);
      const command = new UpdateTariffCommand('t-1');

      await expect(handler.execute(command)).rejects.toThrow(TariffNotFoundException);
    });

    it('should update tariff successfully if found', async () => {
      const existing = new TariffEntity({ id: 't-1', concept: 'Concept', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });
      const updated = new TariffEntity({ id: 't-1', concept: 'New Concept', amount: 120.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });
      tariffRepository.findById.mockResolvedValue(existing);
      tariffRepository.update.mockResolvedValue(updated);

      const handler = new UpdateTariffCommandHandler(tariffRepository);
      const command = new UpdateTariffCommand('t-1', 'New Concept', 120.0);
      const result = await handler.execute(command);

      expect(result).toBe(updated);
    });
  });

  describe('DeleteTariffCommandHandler', () => {
    it('should throw TariffNotFoundException if tariff not found', async () => {
      tariffRepository.findById.mockResolvedValue(null);
      const handler = new DeleteTariffCommandHandler(tariffRepository);
      const command = new DeleteTariffCommand('t-1');

      await expect(handler.execute(command)).rejects.toThrow(TariffNotFoundException);
    });

    it('should delete tariff successfully if found', async () => {
      tariffRepository.findById.mockResolvedValue({});
      const handler = new DeleteTariffCommandHandler(tariffRepository);
      const command = new DeleteTariffCommand('t-1');
      await handler.execute(command);

      expect(tariffRepository.delete).toHaveBeenCalledWith('t-1');
    });
  });
});
