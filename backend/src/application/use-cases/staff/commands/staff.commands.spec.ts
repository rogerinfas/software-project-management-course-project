import {
  CreateStaffProfileCommand,
  CreateStaffProfileCommandHandler,
  UpdateStaffProfileCommand,
  UpdateStaffProfileCommandHandler,
  DeleteStaffProfileCommand,
  DeleteStaffProfileCommandHandler,
  RegisterAttendanceCommand,
  RegisterAttendanceCommandHandler,
  UpdateAttendanceRulesCommand,
  UpdateAttendanceRulesCommandHandler,
} from './staff.commands';
import { StaffProfileEntity } from '../../../../domain/entities/staff-profile.entity';
import { AttendanceRecordEntity } from '../../../../domain/entities/attendance-record.entity';
import { AttendanceRuleEntity } from '../../../../domain/entities/attendance-rule.entity';
import {
  StaffProfileNotFoundException,
  DuplicateStaffProfileException,
} from '../../../../domain/exceptions/staff-domain.exceptions';

describe('Staff Commands', () => {
  let staffRepository: any;
  let recordRepository: any;
  let ruleRepository: any;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    recordRepository = {
      create: jest.fn(),
    };
    ruleRepository = {
      getRule: jest.fn(),
      updateRule: jest.fn(),
    };
  });

  describe('CreateStaffProfileCommandHandler', () => {
    it('should throw DuplicateStaffProfileException if profile exists', async () => {
      staffRepository.findByUserId.mockResolvedValue({});
      const handler = new CreateStaffProfileCommandHandler(staffRepository);
      const command = new CreateStaffProfileCommand('u-1', 'Math');

      await expect(handler.execute(command)).rejects.toThrow(
        DuplicateStaffProfileException,
      );
    });

    it('should create staff profile successfully', async () => {
      staffRepository.findByUserId.mockResolvedValue(null);
      const created = new StaffProfileEntity({
        id: 's-1',
        userId: 'u-1',
        specialty: 'Math',
        cvUrl: 'cv',
        entryTime: '08:00',
        exitTime: '16:00',
        gracePeriod: 5,
      });
      staffRepository.create.mockResolvedValue(created);

      const handler = new CreateStaffProfileCommandHandler(staffRepository);
      const command = new CreateStaffProfileCommand('u-1', 'Math', 'cv');
      const result = await handler.execute(command);

      expect(result).toBe(created);
    });
  });

  describe('RegisterAttendanceCommandHandler', () => {
    it('should throw StaffProfileNotFoundException if profile not found', async () => {
      staffRepository.findById.mockResolvedValue(null);
      const handler = new RegisterAttendanceCommandHandler(
        staffRepository,
        recordRepository,
        ruleRepository,
      );
      const command = new RegisterAttendanceCommand('s-1', 'entry');

      await expect(handler.execute(command)).rejects.toThrow(
        StaffProfileNotFoundException,
      );
    });

    it('should register attendance successfully', async () => {
      const staff = new StaffProfileEntity({
        id: 's-1',
        userId: 'u-1',
        specialty: 'Math',
        entryTime: '08:00',
        exitTime: '16:00',
        gracePeriod: 5,
      });
      staffRepository.findById.mockResolvedValue(staff);
      ruleRepository.getRule.mockResolvedValue({ finePerMinute: 0.5 });

      const timestamp = new Date();
      timestamp.setHours(8);
      timestamp.setMinutes(10); // 10 mins late (target is 8:00 + 5 grace = 8:05)

      const record = new AttendanceRecordEntity({
        id: 'r-1',
        staffId: 's-1',
        type: 'entry',
        timestamp,
        delayMinutes: 10,
        fineAmount: 5.0,
        method: 'FACIAL',
      });
      recordRepository.create.mockResolvedValue(record);

      const handler = new RegisterAttendanceCommandHandler(
        staffRepository,
        recordRepository,
        ruleRepository,
      );
      const command = new RegisterAttendanceCommand('s-1', 'entry', timestamp);
      const result = await handler.execute(command);

      expect(result).toBe(record);
    });
  });
});
