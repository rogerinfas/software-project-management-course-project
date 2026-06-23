import { Test, TestingModule } from '@nestjs/testing';
import { PrismaAttendanceRuleRepository } from './prisma-attendance-rule.repository';
import { PrismaService } from '../prisma.service';
import { AttendanceRuleEntity } from '../../../../domain/entities/attendance-rule.entity';

describe('PrismaAttendanceRuleRepository', () => {
  let repository: PrismaAttendanceRuleRepository;

  const mockPrisma = {
    attendanceRule: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaAttendanceRuleRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaAttendanceRuleRepository>(
      PrismaAttendanceRuleRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return existing rule on getRule', async () => {
    const existing = {
      id: 'rule-1',
      gracePeriodMinutes: 5,
      finePerMinute: 0.5,
    };
    mockPrisma.attendanceRule.findFirst.mockResolvedValue(existing);

    const result = await repository.getRule();

    expect(result).toBeInstanceOf(AttendanceRuleEntity);
    expect(result?.id).toBe('rule-1');
  });

  it('should create default rule on getRule if none exists', async () => {
    mockPrisma.attendanceRule.findFirst.mockResolvedValue(null);
    const created = { id: 'rule-1', gracePeriodMinutes: 5, finePerMinute: 0.5 };
    mockPrisma.attendanceRule.create.mockResolvedValue(created);

    const result = await repository.getRule();

    expect(result?.id).toBe('rule-1');
    expect(mockPrisma.attendanceRule.create).toHaveBeenCalled();
  });

  it('should update existing rule on updateRule', async () => {
    const existing = {
      id: 'rule-1',
      gracePeriodMinutes: 5,
      finePerMinute: 0.5,
    };
    mockPrisma.attendanceRule.findFirst.mockResolvedValue(existing);
    mockPrisma.attendanceRule.update.mockResolvedValue({
      id: 'rule-1',
      gracePeriodMinutes: 10,
      finePerMinute: 0.8,
    });

    const result = await repository.updateRule({
      gracePeriodMinutes: 10,
      finePerMinute: 0.8,
    });

    expect(result.gracePeriodMinutes).toBe(10);
    expect(result.finePerMinute).toBe(0.8);
  });

  it('should create new rule on updateRule if none exists', async () => {
    mockPrisma.attendanceRule.findFirst.mockResolvedValue(null);
    mockPrisma.attendanceRule.create.mockResolvedValue({
      id: 'rule-1',
      gracePeriodMinutes: 10,
      finePerMinute: 0.8,
    });

    const result = await repository.updateRule({
      gracePeriodMinutes: 10,
      finePerMinute: 0.8,
    });

    expect(result.id).toBe('rule-1');
  });
});
