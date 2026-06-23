import { Test, TestingModule } from '@nestjs/testing';
import { PrismaCourseRepository } from './prisma-course.repository';
import { PrismaService } from '../prisma.service';
import { CourseEntity } from '../../../../domain/entities/course.entity';

describe('PrismaCourseRepository', () => {
  let repository: PrismaCourseRepository;

  const mockPrisma = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCourseRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaCourseRepository>(PrismaCourseRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a course', async () => {
    const data = { name: 'Math', description: 'Math Course' };
    mockPrisma.course.create.mockResolvedValue({ id: 'c-1', ...data });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(CourseEntity);
    expect(result.id).toBe('c-1');
  });

  it('should find all courses', async () => {
    mockPrisma.course.findMany.mockResolvedValue([{ id: 'c-1', name: 'Math' }]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Math');
  });

  it('should find course by id', async () => {
    mockPrisma.course.findUnique.mockResolvedValue({ id: 'c-1', name: 'Math' });

    const result = await repository.findById('c-1');

    expect(result?.id).toBe('c-1');
  });

  it('should find course by name', async () => {
    mockPrisma.course.findFirst.mockResolvedValue({ id: 'c-1', name: 'Math' });

    const result = await repository.findByName('Math');

    expect(result?.name).toBe('Math');
  });

  it('should update course', async () => {
    mockPrisma.course.update.mockResolvedValue({ id: 'c-1', name: 'Math II' });

    const result = await repository.update('c-1', { name: 'Math II' });

    expect(result.name).toBe('Math II');
  });

  it('should delete course', async () => {
    mockPrisma.course.delete.mockResolvedValue({});

    await repository.delete('c-1');

    expect(mockPrisma.course.delete).toHaveBeenCalledWith({
      where: { id: 'c-1' },
    });
  });
});
