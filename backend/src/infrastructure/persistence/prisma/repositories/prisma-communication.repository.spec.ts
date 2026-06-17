import { Test, TestingModule } from '@nestjs/testing';
import { PrismaCommunicationRepository } from './prisma-communication.repository';
import { PrismaService } from '../prisma.service';
import { CommunicationEntity } from '../../../../domain/entities/communication.entity';

describe('PrismaCommunicationRepository', () => {
  let repository: PrismaCommunicationRepository;

  const mockPrisma = {
    communication: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCommunicationRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaCommunicationRepository>(PrismaCommunicationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a communication', async () => {
    const data = { title: 'T', content: 'C', category: 'Cat' };
    mockPrisma.communication.create.mockResolvedValue({ id: 'comm-1', ...data, isVisible: true });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(CommunicationEntity);
    expect(result.id).toBe('comm-1');
  });

  it('should find communication by id', async () => {
    mockPrisma.communication.findUnique.mockResolvedValue({ id: 'comm-1', title: 'T' });

    const result = await repository.findById('comm-1');

    expect(result?.id).toBe('comm-1');
  });

  it('should update communication', async () => {
    mockPrisma.communication.update.mockResolvedValue({ id: 'comm-1', title: 'New T' });

    const result = await repository.update('comm-1', { title: 'New T' });

    expect(result.title).toBe('New T');
  });

  it('should delete communication', async () => {
    mockPrisma.communication.delete.mockResolvedValue({});

    await repository.delete('comm-1');

    expect(mockPrisma.communication.delete).toHaveBeenCalledWith({ where: { id: 'comm-1' } });
  });

  it('should find all active communications', async () => {
    mockPrisma.communication.findMany.mockResolvedValue([{ id: 'comm-1' }]);

    const result = await repository.findAllActive();

    expect(result).toHaveLength(1);
  });

  it('should find paginated communications', async () => {
    mockPrisma.communication.findMany.mockResolvedValue([{ id: 'comm-1' }]);
    mockPrisma.communication.count.mockResolvedValue(1);

    const result = await repository.findManyPaginated(1, 10, 'General', 'search');

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
