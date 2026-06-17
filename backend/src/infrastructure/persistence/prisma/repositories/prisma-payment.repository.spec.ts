import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPaymentRepository } from './prisma-payment.repository';
import { PrismaService } from '../prisma.service';
import { PaymentEntity } from '../../../../domain/entities/payment.entity';
import { PaymentMethod } from '@prisma/client';

describe('PrismaPaymentRepository', () => {
  let repository: PrismaPaymentRepository;

  const mockPrisma = {
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaPaymentRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaPaymentRepository>(PrismaPaymentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment', async () => {
    const timestamp = new Date();
    const data = { chargeId: 'ch-1', studentId: 'stud-1', totalAmount: 100.0, method: PaymentMethod.CASH, timestamp };
    mockPrisma.payment.create.mockResolvedValue({ id: 'p-1', ...data, charge: null });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(PaymentEntity);
    expect(result.id).toBe('p-1');
  });

  it('should find payment by id', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'p-1', chargeId: 'ch-1', studentId: 'stud-1', totalAmount: 100.0, method: PaymentMethod.CASH, timestamp: new Date(), charge: null });

    const result = await repository.findById('p-1');

    expect(result?.id).toBe('p-1');
  });

  it('should find payments by charge id', async () => {
    mockPrisma.payment.findMany.mockResolvedValue([{ id: 'p-1', chargeId: 'ch-1', charge: null }]);

    const result = await repository.findByChargeId('ch-1');

    expect(result).toHaveLength(1);
  });

  it('should find payments by student id', async () => {
    mockPrisma.payment.findMany.mockResolvedValue([{ id: 'p-1', studentId: 'stud-1', charge: null }]);

    const result = await repository.findByStudentId('stud-1');

    expect(result).toHaveLength(1);
  });

  it('should find all payments', async () => {
    mockPrisma.payment.findMany.mockResolvedValue([{ id: 'p-1', charge: null }]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});
