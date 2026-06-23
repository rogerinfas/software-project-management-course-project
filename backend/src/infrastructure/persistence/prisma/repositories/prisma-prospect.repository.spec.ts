import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProspectRepository } from './prisma-prospect.repository';
import { PrismaService } from '../prisma.service';
import { ProspectEntity } from '../../../../domain/entities/prospect.entity';
import {
  EducationalLevel,
  ProspectPriority,
  ProspectStage,
} from '@prisma/client';

describe('PrismaProspectRepository', () => {
  let repository: PrismaProspectRepository;

  const mockPrisma = {
    prospect: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProspectRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaProspectRepository>(PrismaProspectRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a prospect', async () => {
    const data = {
      name: 'John Doe',
      phone: '123456789',
      targetGrade: '1',
      level: EducationalLevel.PRIMARY,
      priority: ProspectPriority.HIGH,
      stage: ProspectStage.ENTREVISTA,
    };
    mockPrisma.prospect.create.mockResolvedValue({
      id: 'p-1',
      ...data,
      appointments: [],
      evaluation: null,
    });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(ProspectEntity);
    expect(result.id).toBe('p-1');
  });

  it('should find prospect by id', async () => {
    mockPrisma.prospect.findUnique.mockResolvedValue({
      id: 'p-1',
      name: 'John Doe',
      phone: '123456789',
      targetGrade: '1',
      level: EducationalLevel.PRIMARY,
      priority: ProspectPriority.HIGH,
      stage: ProspectStage.ENTREVISTA,
      appointments: [],
      evaluation: null,
    });

    const result = await repository.findById('p-1');

    expect(result?.id).toBe('p-1');
  });

  it('should update prospect', async () => {
    mockPrisma.prospect.update.mockResolvedValue({
      id: 'p-1',
      name: 'John Doe II',
      phone: '123456789',
      targetGrade: '1',
      level: EducationalLevel.PRIMARY,
      priority: ProspectPriority.HIGH,
      stage: ProspectStage.ENTREVISTA,
      appointments: [],
      evaluation: null,
    });

    const result = await repository.update('p-1', { name: 'John Doe II' });

    expect(result.name).toBe('John Doe II');
  });

  it('should find prospects paginated', async () => {
    mockPrisma.$transaction.mockResolvedValue([
      1,
      [
        {
          id: 'p-1',
          name: 'John Doe',
          phone: '123456789',
          targetGrade: '1',
          level: EducationalLevel.PRIMARY,
          priority: ProspectPriority.HIGH,
          stage: ProspectStage.ENTREVISTA,
          appointments: [],
          evaluation: null,
        },
      ],
    ]);

    const result = await repository.findManyPaginated(1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
