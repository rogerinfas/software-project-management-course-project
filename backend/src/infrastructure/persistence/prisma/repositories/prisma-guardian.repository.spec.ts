import { Test, TestingModule } from '@nestjs/testing';
import { PrismaGuardianRepository } from './prisma-guardian.repository';
import { PrismaService } from '../prisma.service';
import { GuardianEntity } from '../../../../domain/entities/guardian.entity';

describe('PrismaGuardianRepository', () => {
  let repository: PrismaGuardianRepository;

  const mockPrisma = {
    guardian: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaGuardianRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaGuardianRepository>(PrismaGuardianRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a guardian', async () => {
    const data = { dni: '12345678', name: 'G Name', phone: '987654321', email: 'g@g.com', occupation: 'O' };
    mockPrisma.guardian.create.mockResolvedValue({ id: 'g-1', ...data, students: [] });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(GuardianEntity);
    expect(result.id).toBe('g-1');
  });

  it('should find guardian by id', async () => {
    mockPrisma.guardian.findUnique.mockResolvedValue({ id: 'g-1', dni: '12345678', name: 'G Name', phone: '987654321', email: 'g@g.com', occupation: 'O', students: [] });

    const result = await repository.findById('g-1');

    expect(result?.id).toBe('g-1');
  });

  it('should find guardian by dni', async () => {
    mockPrisma.guardian.findUnique.mockResolvedValue({ id: 'g-1', dni: '12345678', name: 'G Name', phone: '987654321', email: 'g@g.com', occupation: 'O', students: [] });

    const result = await repository.findByDni('12345678');

    expect(result?.id).toBe('g-1');
  });

  it('should update guardian', async () => {
    mockPrisma.guardian.update.mockResolvedValue({ id: 'g-1', dni: '12345678', name: 'G Name II', phone: '987654321', email: 'g@g.com', occupation: 'O', students: [] });

    const result = await repository.update('g-1', { name: 'G Name II' });

    expect(result.name).toBe('G Name II');
  });

  it('should delete guardian', async () => {
    mockPrisma.guardian.delete.mockResolvedValue({ id: 'g-1', dni: '12345678', name: 'G Name', phone: '987654321', email: 'g@g.com', occupation: 'O', students: [] });

    const result = await repository.delete('g-1');

    expect(result.id).toBe('g-1');
  });

  it('should find guardians paginated', async () => {
    mockPrisma.$transaction.mockResolvedValue([
      1,
      [{ id: 'g-1', dni: '12345678', name: 'G Name', phone: '987654321', email: 'g@g.com', occupation: 'O', students: [] }],
    ]);

    const result = await repository.findManyPaginated(1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
