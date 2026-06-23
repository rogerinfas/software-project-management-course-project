import { Test, TestingModule } from '@nestjs/testing';
import { PrismaChargeRepository } from './prisma-charge.repository';
import { PrismaService } from '../prisma.service';
import { ChargeEntity } from '../../../../domain/entities/charge.entity';

describe('PrismaChargeRepository', () => {
  let repository: PrismaChargeRepository;

  const mockPrisma = {
    charge: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaChargeRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaChargeRepository>(PrismaChargeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a charge', async () => {
    const data = {
      studentId: 'stud-1',
      tariffId: 'tariff-1',
      originalAmount: 100.0,
      pendingAmount: 100.0,
      dueDate: new Date(),
      status: 'PENDING',
    };
    mockPrisma.charge.create.mockResolvedValue({
      id: 'ch-1',
      ...data,
      student: null,
      tariff: null,
    });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(ChargeEntity);
    expect(result.id).toBe('ch-1');
  });

  it('should find charge by id', async () => {
    mockPrisma.charge.findUnique.mockResolvedValue({
      id: 'ch-1',
      studentId: 'stud-1',
      tariffId: 'tariff-1',
      originalAmount: 100.0,
      pendingAmount: 100.0,
      dueDate: new Date(),
      status: 'PENDING',
      student: null,
      tariff: null,
    });

    const result = await repository.findById('ch-1');

    expect(result?.id).toBe('ch-1');
  });

  it('should find charges by student id', async () => {
    mockPrisma.charge.findMany.mockResolvedValue([
      { id: 'ch-1', studentId: 'stud-1', student: null, tariff: null },
    ]);

    const result = await repository.findByStudentId('stud-1');

    expect(result).toHaveLength(1);
  });

  it('should update charge', async () => {
    mockPrisma.charge.update.mockResolvedValue({
      id: 'ch-1',
      studentId: 'stud-1',
      tariffId: 'tariff-1',
      originalAmount: 100.0,
      pendingAmount: 80.0,
      dueDate: new Date(),
      status: 'PARTIAL',
      student: null,
      tariff: null,
    });

    const result = await repository.update('ch-1', {
      pendingAmount: 80.0,
      status: 'PARTIAL',
    });

    expect(result.pendingAmount).toBe(80.0);
    expect(result.status).toBe('PARTIAL');
  });

  it('should delete charge', async () => {
    mockPrisma.charge.delete.mockResolvedValue({});

    await repository.delete('ch-1');

    expect(mockPrisma.charge.delete).toHaveBeenCalledWith({
      where: { id: 'ch-1' },
    });
  });

  it('should find all charges', async () => {
    mockPrisma.charge.findMany.mockResolvedValue([
      { id: 'ch-1', student: null, tariff: null },
    ]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});
