import { Test, TestingModule } from '@nestjs/testing';
import { PrismaEnrollmentRepository } from './prisma-enrollment.repository';
import { PrismaService } from '../prisma.service';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment.entity';

describe('PrismaEnrollmentRepository', () => {
  let repository: PrismaEnrollmentRepository;

  const mockPrisma = {
    enrollment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaEnrollmentRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaEnrollmentRepository>(PrismaEnrollmentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an enrollment', async () => {
    const data = { studentId: 'stud-1', year: 2026, status: 'activa', pdfUrl: 'pdf' };
    mockPrisma.enrollment.create.mockResolvedValue({ id: 'e-1', ...data, student: null });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(EnrollmentEntity);
    expect(result.id).toBe('e-1');
  });

  it('should find enrollment by id', async () => {
    mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 'e-1', studentId: 'stud-1', year: 2026, status: 'activa', pdfUrl: 'pdf', student: null });

    const result = await repository.findById('e-1');

    expect(result?.id).toBe('e-1');
  });

  it('should find by student id', async () => {
    mockPrisma.enrollment.findMany.mockResolvedValue([{ id: 'e-1', studentId: 'stud-1', student: null }]);

    const result = await repository.findByStudentId('stud-1');

    expect(result).toHaveLength(1);
  });

  it('should find enrollments paginated', async () => {
    mockPrisma.$transaction.mockResolvedValue([
      1,
      [{ id: 'e-1', studentId: 'stud-1', student: null }],
    ]);

    const result = await repository.findManyPaginated(1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
