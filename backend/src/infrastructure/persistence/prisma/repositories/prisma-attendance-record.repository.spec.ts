import { Test, TestingModule } from '@nestjs/testing';
import { PrismaAttendanceRecordRepository } from './prisma-attendance-record.repository';
import { PrismaService } from '../prisma.service';
import { AttendanceRecordEntity } from '../../../../domain/entities/attendance-record.entity';

describe('PrismaAttendanceRecordRepository', () => {
  let repository: PrismaAttendanceRecordRepository;

  const mockPrisma = {
    attendanceRecord: {
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
        PrismaAttendanceRecordRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaAttendanceRecordRepository>(
      PrismaAttendanceRecordRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an attendance record', async () => {
    const timestamp = new Date();
    const data = {
      staffId: 's-1',
      type: 'entry',
      timestamp,
      delayMinutes: 0,
      fineAmount: 0.0,
      method: 'FACIAL',
    };
    mockPrisma.attendanceRecord.create.mockResolvedValue({
      id: 'r-1',
      ...data,
      staff: null,
    });

    const result = await repository.create(data);

    expect(result).toBeInstanceOf(AttendanceRecordEntity);
    expect(result.id).toBe('r-1');
  });

  it('should find record by id', async () => {
    mockPrisma.attendanceRecord.findUnique.mockResolvedValue({
      id: 'r-1',
      staffId: 's-1',
      type: 'entry',
      timestamp: new Date(),
      delayMinutes: 0,
      fineAmount: 0.0,
      method: 'FACIAL',
      staff: null,
    });

    const result = await repository.findById('r-1');

    expect(result?.id).toBe('r-1');
  });

  it('should find records by staff id', async () => {
    mockPrisma.attendanceRecord.findMany.mockResolvedValue([
      { id: 'r-1', staffId: 's-1', staff: null },
    ]);

    const result = await repository.findByStaffId('s-1');

    expect(result).toHaveLength(1);
  });

  it('should update attendance record', async () => {
    mockPrisma.attendanceRecord.update.mockResolvedValue({
      id: 'r-1',
      staffId: 's-1',
      type: 'exit',
      timestamp: new Date(),
      delayMinutes: 0,
      fineAmount: 0.0,
      method: 'FACIAL',
      staff: null,
    });

    const result = await repository.update('r-1', { type: 'exit' });

    expect(result.type).toBe('exit');
  });

  it('should delete attendance record', async () => {
    mockPrisma.attendanceRecord.delete.mockResolvedValue({});

    await repository.delete('r-1');

    expect(mockPrisma.attendanceRecord.delete).toHaveBeenCalledWith({
      where: { id: 'r-1' },
    });
  });

  it('should find all attendance records', async () => {
    mockPrisma.attendanceRecord.findMany.mockResolvedValue([
      { id: 'r-1', staff: null },
    ]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});
