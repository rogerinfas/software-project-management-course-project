import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaService } from '../prisma.service';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { Role } from '@prisma/client';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prismaService: any;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test',
      role: Role.ADMIN,
    };
    mockPrisma.user.create.mockResolvedValue({
      id: 'u-1',
      ...userData,
      emailVerified: false,
      image: null,
    });

    const result = await repository.create(userData as any);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBe('u-1');
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  it('should find all users', async () => {
    mockPrisma.user.findMany.mockResolvedValue([
      { id: 'u-1', email: 'test@example.com' },
    ]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u-1');
  });

  it('should find user by id', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      email: 'test@example.com',
    });

    const result = await repository.findById('u-1');

    expect(result?.id).toBe('u-1');
  });

  it('should find user by email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      email: 'test@example.com',
    });

    const result = await repository.findByEmail('test@example.com');

    expect(result?.email).toBe('test@example.com');
  });

  it('should update user', async () => {
    mockPrisma.user.update.mockResolvedValue({
      id: 'u-1',
      email: 'test@example.com',
      name: 'New Name',
    });

    const result = await repository.update('u-1', { name: 'New Name' });

    expect(result.name).toBe('New Name');
  });

  it('should delete user', async () => {
    mockPrisma.user.delete.mockResolvedValue({});

    await repository.delete('u-1');

    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: 'u-1' },
    });
  });

  it('should find users paginated', async () => {
    mockPrisma.$transaction.mockResolvedValue([
      [{ id: 'u-1', email: 'test@example.com' }],
      1,
    ]);

    const result = await repository.findManyPaginated(1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
