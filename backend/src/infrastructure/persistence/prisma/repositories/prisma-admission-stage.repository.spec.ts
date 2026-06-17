import { Test, TestingModule } from '@nestjs/testing';
import { PrismaAdmissionStageRepository } from './prisma-admission-stage.repository';
import { PrismaService } from '../prisma.service';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

describe('PrismaAdmissionStageRepository', () => {
  let repository: PrismaAdmissionStageRepository;

  const mockPrisma = {
    admissionStage: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaAdmissionStageRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaAdmissionStageRepository>(PrismaAdmissionStageRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an admission stage', async () => {
    const data = { name: 'Stage 1', order: 1 };
    mockPrisma.admissionStage.create.mockResolvedValue({ id: 's-1', ...data });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(AdmissionStageEntity);
    expect(result.id).toBe('s-1');
  });

  it('should find stage by id', async () => {
    mockPrisma.admissionStage.findUnique.mockResolvedValue({ id: 's-1', name: 'Stage 1' });

    const result = await repository.findById('s-1');

    expect(result?.id).toBe('s-1');
  });

  it('should update stage', async () => {
    mockPrisma.admissionStage.update.mockResolvedValue({ id: 's-1', name: 'New Name' });

    const result = await repository.update('s-1', { name: 'New Name' });

    expect(result.name).toBe('New Name');
  });

  it('should delete stage', async () => {
    mockPrisma.admissionStage.delete.mockResolvedValue({});

    await repository.delete('s-1');

    expect(mockPrisma.admissionStage.delete).toHaveBeenCalledWith({ where: { id: 's-1' } });
  });

  it('should find all stages with prospects', async () => {
    mockPrisma.admissionStage.findMany.mockResolvedValue([
      { id: 's-1', name: 'Stage 1', order: 1, prospects: [] },
    ]);

    const result = await repository.findAllWithProspects();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s-1');
  });
});
