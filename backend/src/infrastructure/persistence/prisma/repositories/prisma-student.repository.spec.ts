import { Test, TestingModule } from '@nestjs/testing';
import { PrismaStudentRepository } from './prisma-student.repository';
import { PrismaService } from '../prisma.service';
import { StudentEntity } from '../../../../domain/entities/student.entity';
import { EducationalLevel } from '@prisma/client';

describe('PrismaStudentRepository', () => {
  let repository: PrismaStudentRepository;

  const mockPrisma = {
    student: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaStudentRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaStudentRepository>(PrismaStudentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a student', async () => {
    const data = { code: 'c-1', firstName: 'John', lastName: 'Doe', dni: '12345678', level: EducationalLevel.PRIMARY, grade: '1', sectionId: 's-1', guardianId: 'g-1' };
    mockPrisma.student.create.mockResolvedValue({ id: 'stud-1', ...data, guardian: null, section: null, enrollments: [] });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(StudentEntity);
    expect(result.id).toBe('stud-1');
  });

  it('should find student by id', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 'stud-1', code: 'c-1', firstName: 'John', lastName: 'Doe', dni: '12345678', level: EducationalLevel.PRIMARY, grade: '1', sectionId: 's-1', guardianId: 'g-1', guardian: null, section: null, enrollments: [] });

    const result = await repository.findById('stud-1');

    expect(result?.id).toBe('stud-1');
  });

  it('should find student by dni', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 'stud-1', code: 'c-1', firstName: 'John', lastName: 'Doe', dni: '12345678', level: EducationalLevel.PRIMARY, grade: '1', sectionId: 's-1', guardianId: 'g-1', guardian: null, section: null, enrollments: [] });

    const result = await repository.findByDni('12345678');

    expect(result?.id).toBe('stud-1');
  });

  it('should update student', async () => {
    mockPrisma.student.update.mockResolvedValue({ id: 'stud-1', code: 'c-1', firstName: 'John II', lastName: 'Doe', dni: '12345678', level: EducationalLevel.PRIMARY, grade: '1', sectionId: 's-1', guardianId: 'g-1', guardian: null, section: null, enrollments: [] });

    const result = await repository.update('stud-1', { firstName: 'John II' });

    expect(result.firstName).toBe('John II');
  });

  it('should find students paginated', async () => {
    mockPrisma.$transaction.mockResolvedValue([
      1,
      [{ id: 'stud-1', code: 'c-1', firstName: 'John', lastName: 'Doe', dni: '12345678', level: EducationalLevel.PRIMARY, grade: '1', sectionId: 's-1', guardianId: 'g-1', guardian: null, section: null, enrollments: [] }],
    ]);

    const result = await repository.findManyPaginated(1, 10);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
