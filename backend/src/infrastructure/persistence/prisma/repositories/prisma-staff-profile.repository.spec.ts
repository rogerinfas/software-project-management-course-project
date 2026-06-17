import { Test, TestingModule } from '@nestjs/testing';
import { PrismaStaffProfileRepository } from './prisma-staff-profile.repository';
import { PrismaService } from '../prisma.service';
import { StaffProfileEntity } from '../../../../domain/entities/staff-profile.entity';

describe('PrismaStaffProfileRepository', () => {
  let repository: PrismaStaffProfileRepository;

  const mockPrisma = {
    staffProfile: {
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
        PrismaStaffProfileRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaStaffProfileRepository>(PrismaStaffProfileRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a staff profile', async () => {
    const data = { userId: 'u-1', specialty: 'Math', cvUrl: 'cv', entryTime: '08:00', exitTime: '16:00', gracePeriod: 5 };
    mockPrisma.staffProfile.create.mockResolvedValue({ id: 's-1', ...data, user: null });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(StaffProfileEntity);
    expect(result.id).toBe('s-1');
  });

  it('should find staff profile by id', async () => {
    mockPrisma.staffProfile.findUnique.mockResolvedValue({ id: 's-1', userId: 'u-1', specialty: 'Math', cvUrl: 'cv', entryTime: '08:00', exitTime: '16:00', gracePeriod: 5, user: null });

    const result = await repository.findById('s-1');

    expect(result?.id).toBe('s-1');
  });

  it('should find staff profile by userId', async () => {
    mockPrisma.staffProfile.findUnique.mockResolvedValue({ id: 's-1', userId: 'u-1', specialty: 'Math', cvUrl: 'cv', entryTime: '08:00', exitTime: '16:00', gracePeriod: 5, user: null });

    const result = await repository.findByUserId('u-1');

    expect(result?.id).toBe('s-1');
  });

  it('should update staff profile', async () => {
    mockPrisma.staffProfile.update.mockResolvedValue({ id: 's-1', userId: 'u-1', specialty: 'Science', cvUrl: 'cv', entryTime: '08:00', exitTime: '16:00', gracePeriod: 5, user: null });

    const result = await repository.update('s-1', { specialty: 'Science' });

    expect(result.specialty).toBe('Science');
  });

  it('should delete staff profile', async () => {
    mockPrisma.staffProfile.delete.mockResolvedValue({});

    await repository.delete('s-1');

    expect(mockPrisma.staffProfile.delete).toHaveBeenCalledWith({ where: { id: 's-1' } });
  });

  it('should find all staff profiles', async () => {
    mockPrisma.staffProfile.findMany.mockResolvedValue([{ id: 's-1', user: null }]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});
