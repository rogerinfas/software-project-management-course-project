import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProspectInteractionRepository } from './prisma-interaction.repository';
import { PrismaService } from '../prisma.service';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';

describe('PrismaProspectInteractionRepository', () => {
  let repository: PrismaProspectInteractionRepository;

  const mockPrisma = {
    prospectInteraction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProspectInteractionRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaProspectInteractionRepository>(PrismaProspectInteractionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an interaction', async () => {
    mockPrisma.prospectInteraction.create.mockResolvedValue({ id: 'i-1', prospectId: 'p-1', type: 'Call', summary: 'Called', author: 'Admin', date: new Date() });

    const result = await repository.create({ prospectId: 'p-1', type: 'Call', summary: 'Called', author: 'Admin' });

    expect(result).toBeInstanceOf(ProspectInteractionEntity);
    expect(result.id).toBe('i-1');
  });

  it('should find by id', async () => {
    mockPrisma.prospectInteraction.findUnique.mockResolvedValue({ id: 'i-1', prospectId: 'p-1', type: 'Call', summary: 'Called', author: 'Admin', date: new Date() });

    const result = await repository.findById('i-1');

    expect(result?.id).toBe('i-1');
  });

  it('should update interaction', async () => {
    mockPrisma.prospectInteraction.update.mockResolvedValue({ id: 'i-1', prospectId: 'p-1', type: 'Call', summary: 'Updated', author: 'Admin', date: new Date() });

    const result = await repository.update('i-1', { summary: 'Updated' });

    expect(result.summary).toBe('Updated');
  });

  it('should find by prospect id', async () => {
    mockPrisma.prospectInteraction.findMany.mockResolvedValue([{ id: 'i-1', prospectId: 'p-1' }]);

    const result = await repository.findByProspectId('p-1');

    expect(result).toHaveLength(1);
  });
});
