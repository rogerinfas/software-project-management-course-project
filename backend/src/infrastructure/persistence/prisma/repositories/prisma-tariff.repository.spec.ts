import { Test, TestingModule } from '@nestjs/testing';
import { PrismaTariffRepository } from './prisma-tariff.repository';
import { PrismaService } from '../prisma.service';
import { TariffEntity } from '../../../../domain/entities/tariff.entity';
import { TariffType, EducationalLevel } from '@prisma/client';

describe('PrismaTariffRepository', () => {
  let repository: PrismaTariffRepository;

  const mockPrisma = {
    tariff: {
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
        PrismaTariffRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaTariffRepository>(PrismaTariffRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a tariff', async () => {
    const data = { concept: 'C', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY };
    mockPrisma.tariff.create.mockResolvedValue({ id: 't-1', ...data });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(TariffEntity);
    expect(result.id).toBe('t-1');
  });

  it('should find tariff by id', async () => {
    mockPrisma.tariff.findUnique.mockResolvedValue({ id: 't-1', concept: 'C', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });

    const result = await repository.findById('t-1');

    expect(result?.id).toBe('t-1');
  });

  it('should update tariff', async () => {
    mockPrisma.tariff.update.mockResolvedValue({ id: 't-1', concept: 'New C', amount: 100.0, type: TariffType.EXTRA, level: EducationalLevel.PRIMARY });

    const result = await repository.update('t-1', { concept: 'New C' });

    expect(result.concept).toBe('New C');
  });

  it('should delete tariff', async () => {
    mockPrisma.tariff.delete.mockResolvedValue({});

    await repository.delete('t-1');

    expect(mockPrisma.tariff.delete).toHaveBeenCalledWith({ where: { id: 't-1' } });
  });

  it('should find all tariffs', async () => {
    mockPrisma.tariff.findMany.mockResolvedValue([{ id: 't-1' }]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});
