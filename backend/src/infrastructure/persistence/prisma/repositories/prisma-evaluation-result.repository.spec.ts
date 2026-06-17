import { Test, TestingModule } from '@nestjs/testing';
import { PrismaEvaluationResultRepository } from './prisma-evaluation-result.repository';
import { PrismaService } from '../prisma.service';
import { EvaluationResultEntity } from '../../../../domain/entities/evaluation-result.entity';
import { EvaluationStatus } from '@prisma/client';

describe('PrismaEvaluationResultRepository', () => {
  let repository: PrismaEvaluationResultRepository;

  const mockPrisma = {
    evaluationResult: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaEvaluationResultRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaEvaluationResultRepository>(PrismaEvaluationResultRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an evaluation result', async () => {
    mockPrisma.evaluationResult.create.mockResolvedValue({ id: 'e-1', prospectId: 'p-1', aptitude: EvaluationStatus.FIT });

    const result = await repository.create({ prospectId: 'p-1', aptitude: EvaluationStatus.FIT });

    expect(result).toBeInstanceOf(EvaluationResultEntity);
    expect(result.id).toBe('e-1');
  });

  it('should find by prospect id', async () => {
    mockPrisma.evaluationResult.findUnique.mockResolvedValue({ id: 'e-1', prospectId: 'p-1', aptitude: EvaluationStatus.FIT });

    const result = await repository.findByProspectId('p-1');

    expect(result?.id).toBe('e-1');
  });

  it('should update evaluation result', async () => {
    mockPrisma.evaluationResult.update.mockResolvedValue({ id: 'e-1', prospectId: 'p-1', aptitude: EvaluationStatus.UNFIT });

    const result = await repository.update('p-1', { aptitude: EvaluationStatus.UNFIT });

    expect(result.aptitude).toBe(EvaluationStatus.UNFIT);
  });
});
