import { Test, TestingModule } from '@nestjs/testing';
import { PrismaSectionRepository } from './prisma-section.repository';
import { PrismaService } from '../prisma.service';
import { SectionEntity } from '../../../../domain/entities/section.entity';
import { EducationalLevel } from '@prisma/client';

describe('PrismaSectionRepository', () => {
  let repository: PrismaSectionRepository;

  const mockPrisma = {
    section: {
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
        PrismaSectionRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaSectionRepository>(PrismaSectionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a section', async () => {
    const data = {
      name: 'A',
      grade: '1',
      level: EducationalLevel.PRIMARY,
      capacity: 25,
    };
    mockPrisma.section.create.mockResolvedValue({
      id: 's-1',
      ...data,
      status: 'OPEN',
      students: [],
    });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(SectionEntity);
    expect(result.id).toBe('s-1');
  });

  it('should find all sections', async () => {
    mockPrisma.section.findMany.mockResolvedValue([
      {
        id: 's-1',
        name: 'A',
        grade: '1',
        level: EducationalLevel.PRIMARY,
        capacity: 25,
        status: 'OPEN',
        students: [],
      },
    ]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('A');
  });

  it('should find section by id', async () => {
    mockPrisma.section.findUnique.mockResolvedValue({
      id: 's-1',
      name: 'A',
      grade: '1',
      level: EducationalLevel.PRIMARY,
      capacity: 25,
      status: 'OPEN',
      students: [],
    });

    const result = await repository.findById('s-1');

    expect(result?.id).toBe('s-1');
  });

  it('should update section', async () => {
    mockPrisma.section.update.mockResolvedValue({
      id: 's-1',
      name: 'B',
      grade: '1',
      level: EducationalLevel.PRIMARY,
      capacity: 25,
      status: 'OPEN',
      students: [],
    });

    const result = await repository.update('s-1', { name: 'B' });

    expect(result.name).toBe('B');
  });

  it('should delete section', async () => {
    mockPrisma.section.delete.mockResolvedValue({});

    await repository.delete('s-1');

    expect(mockPrisma.section.delete).toHaveBeenCalledWith({
      where: { id: 's-1' },
    });
  });
});
