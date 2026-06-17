import {
  GetStaffProfilesQuery,
  GetStaffProfilesQueryHandler,
  GetStaffProfileByIdQuery,
  GetStaffProfileByIdQueryHandler,
  GetAttendanceRecordsQuery,
  GetAttendanceRecordsQueryHandler,
  GetAttendanceRuleQuery,
  GetAttendanceRuleQueryHandler,
} from './staff.queries';
import { StaffProfileEntity } from '../../../../domain/entities/staff-profile.entity';
import { AttendanceRecordEntity } from '../../../../domain/entities/attendance-record.entity';
import { AttendanceRuleEntity } from '../../../../domain/entities/attendance-rule.entity';

describe('Staff Queries', () => {
  let staffRepository: any;
  let recordRepository: any;
  let ruleRepository: any;

  beforeEach(() => {
    staffRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    recordRepository = {
      findAll: jest.fn(),
      findByStaffId: jest.fn(),
    };
    ruleRepository = {
      getRule: jest.fn(),
    };
  });

  describe('GetStaffProfilesQueryHandler', () => {
    it('should return all profiles', async () => {
      const list = [new StaffProfileEntity({ id: 's-1', userId: 'u-1', specialty: 'Math', entryTime: '08:00', exitTime: '16:00', gracePeriod: 5 })];
      staffRepository.findAll.mockResolvedValue(list);

      const handler = new GetStaffProfilesQueryHandler(staffRepository);
      const result = await handler.execute(new GetStaffProfilesQuery());

      expect(result).toBe(list);
    });
  });

  describe('GetStaffProfileByIdQueryHandler', () => {
    it('should return a profile by ID', async () => {
      const staff = new StaffProfileEntity({ id: 's-1', userId: 'u-1', specialty: 'Math', entryTime: '08:00', exitTime: '16:00', gracePeriod: 5 });
      staffRepository.findById.mockResolvedValue(staff);

      const handler = new GetStaffProfileByIdQueryHandler(staffRepository);
      const result = await handler.execute(new GetStaffProfileByIdQuery('s-1'));

      expect(result).toBe(staff);
    });
  });

  describe('GetAttendanceRecordsQueryHandler', () => {
    it('should return all records if no staffId provided', async () => {
      const list = [new AttendanceRecordEntity({ id: 'r-1', staffId: 's-1', type: 'entry', timestamp: new Date(), delayMinutes: 0, fineAmount: 0.0, method: 'FACIAL' })];
      recordRepository.findAll.mockResolvedValue(list);

      const handler = new GetAttendanceRecordsQueryHandler(recordRepository);
      const result = await handler.execute(new GetAttendanceRecordsQuery());

      expect(result).toBe(list);
    });

    it('should return filtered records if staffId provided', async () => {
      const list = [new AttendanceRecordEntity({ id: 'r-1', staffId: 's-1', type: 'entry', timestamp: new Date(), delayMinutes: 0, fineAmount: 0.0, method: 'FACIAL' })];
      recordRepository.findByStaffId.mockResolvedValue(list);

      const handler = new GetAttendanceRecordsQueryHandler(recordRepository);
      const result = await handler.execute(new GetAttendanceRecordsQuery('s-1'));

      expect(result).toBe(list);
      expect(recordRepository.findByStaffId).toHaveBeenCalledWith('s-1');
    });
  });

  describe('GetAttendanceRuleQueryHandler', () => {
    it('should return attendance rule', async () => {
      const rule = new AttendanceRuleEntity({ id: 'rule-1', gracePeriodMinutes: 5, finePerMinute: 0.5 });
      ruleRepository.getRule.mockResolvedValue(rule);

      const handler = new GetAttendanceRuleQueryHandler(ruleRepository);
      const result = await handler.execute(new GetAttendanceRuleQuery());

      expect(result).toBe(rule);
    });
  });
});
