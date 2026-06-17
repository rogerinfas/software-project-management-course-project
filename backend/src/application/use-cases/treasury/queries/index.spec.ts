import {
  GetTariffsQuery,
  GetTariffsQueryHandler,
  GetChargesQuery,
  GetChargesQueryHandler,
  GetPaymentsQuery,
  GetPaymentsQueryHandler,
} from './index';

describe('Treasury Queries', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = {
      tariff: { findMany: jest.fn() },
      charge: { findMany: jest.fn() },
      payment: { findMany: jest.fn() },
    };
  });

  describe('GetTariffsQueryHandler', () => {
    it('should find all tariffs', async () => {
      const handler = new GetTariffsQueryHandler(prisma);
      prisma.tariff.findMany.mockResolvedValue([]);

      await handler.execute();

      expect(prisma.tariff.findMany).toHaveBeenCalledWith({
        orderBy: { concept: 'asc' },
      });
    });
  });

  describe('GetChargesQueryHandler', () => {
    it('should find all charges with filters', async () => {
      const handler = new GetChargesQueryHandler(prisma);
      prisma.charge.findMany.mockResolvedValue([]);

      const query = new GetChargesQuery('stud-1', 'PENDING');
      await handler.execute(query);

      expect(prisma.charge.findMany).toHaveBeenCalledWith({
        where: { studentId: 'stud-1', status: 'PENDING' },
        include: { student: true, tariff: true },
        orderBy: { dueDate: 'asc' },
      });
    });
  });

  describe('GetPaymentsQueryHandler', () => {
    it('should find all payments with filters', async () => {
      const handler = new GetPaymentsQueryHandler(prisma);
      prisma.payment.findMany.mockResolvedValue([]);

      const query = new GetPaymentsQuery('stud-1', 'ch-1');
      await handler.execute(query);

      expect(prisma.payment.findMany).toHaveBeenCalledWith({
        where: { studentId: 'stud-1', chargeId: 'ch-1' },
        include: {
          charge: {
            include: { tariff: true, student: true },
          },
        },
        orderBy: { timestamp: 'desc' },
      });
    });
  });
});
