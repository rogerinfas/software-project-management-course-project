import { Test, TestingModule } from '@nestjs/testing';
import { PrismaScheduleRepository } from './prisma-schedule.repository';
import { PrismaService } from '../prisma.service';
import { ScheduleEntity } from '../../../../domain/entities/schedule.entity';

describe('PrismaScheduleRepository', () => {
  let repository: PrismaScheduleRepository;

  const mockPrisma = {
    schedule: {
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
        PrismaScheduleRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaScheduleRepository>(PrismaScheduleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create schedule', async () => {
    const data = { sectionId: 's-1', courseId: 'c-1', staffId: 'st-1', day: 1, startTime: '08:00', endTime: '10:00' };
    mockPrisma.schedule.create.mockResolvedValue({ id: 'sch-1', ...data });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(ScheduleEntity);
    expect(result.id).toBe('sch-1');
  });

  it('should find by section', async () => {
    mockPrisma.schedule.findMany.mockResolvedValue([{ id: 'sch-1', sectionId: 's-1' }]);

    const result = await repository.findBySection('s-1');

    expect(result).toHaveLength(1);
    expect(result[0].sectionId).toBe('s-1');
  });

  it('should find by teacher', async () => {
    mockPrisma.schedule.findMany.mockResolvedValue([{ id: 'sch-1', staffId: 'st-1' }]);

    const result = await repository.findByTeacher('st-1');

    expect(result).toHaveLength(1);
    expect(result[0].staffId).toBe('st-1');
  });

  it('should check conflicts', async () => {
    mockPrisma.schedule.findMany.mockResolvedValue([{ id: 'sch-1', day: 1 }]);

    const result = await repository.checkConflicts(1, '08:00', '10:00', 's-1', 'st-1');

    expect(result).toHaveLength(1);
  });

  it('should find all schedules', async () => {
    mockPrisma.schedule.findMany.mockResolvedValue([{ id: 'sch-1' }]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});
