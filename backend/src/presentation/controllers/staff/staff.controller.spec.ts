import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { StaffProfileEntity } from '../../../domain/entities/staff-profile.entity';
import { AttendanceRecordEntity } from '../../../domain/entities/attendance-record.entity';
import { AttendanceRuleEntity } from '../../../domain/entities/attendance-rule.entity';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DomainException } from '../../../domain/exceptions/domain-exception';

describe('StaffController (Unit)', () => {
  let controller: StaffController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe('createProfile', () => {
    it('should create and return staff profile', async () => {
      const profile = {
        id: 's-1',
        userId: 'u-1',
        specialty: 'Math',
        cvUrl: 'cv',
        entryTime: '08:00',
        exitTime: '16:00',
        gracePeriod: 5,
      };
      commandBus.execute.mockResolvedValue(profile);

      const result = await controller.createProfile({
        userId: 'u-1',
        specialty: 'Math',
        cvUrl: 'cv',
        entryTime: '08:00',
        exitTime: '16:00',
        gracePeriod: 5,
      });

      expect(result).toBeInstanceOf(StaffProfileEntity);
      expect(result.id).toBe('s-1');
    });

    it('should throw ConflictException if domain exception occurs', async () => {
      commandBus.execute.mockRejectedValue(new DomainException('Exists'));

      await expect(
        controller.createProfile({ userId: 'u-1', specialty: 'Math' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfiles', () => {
    it('should return all profiles', async () => {
      commandBus.execute.mockResolvedValue([]);
      queryBus.execute.mockResolvedValue([{ id: 's-1' }]);

      const result = await controller.getProfiles();

      expect(result).toHaveLength(1);
    });
  });

  describe('getProfileById', () => {
    it('should return staff profile if found', async () => {
      queryBus.execute.mockResolvedValue({ id: 's-1' });

      const result = await controller.getProfileById('s-1');

      expect(result.id).toBe('s-1');
    });

    it('should throw NotFoundException if profile not found', async () => {
      queryBus.execute.mockResolvedValue(null);

      await expect(controller.getProfileById('s-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      commandBus.execute.mockResolvedValue({ id: 's-1', specialty: 'Science' });

      const result = await controller.updateProfile('s-1', {
        specialty: 'Science',
      });

      expect(result.specialty).toBe('Science');
    });

    it('should throw NotFoundException if update fails with DomainException', async () => {
      commandBus.execute.mockRejectedValue(new DomainException('Not found'));

      await expect(
        controller.updateProfile('s-1', { specialty: 'Science' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProfile', () => {
    it('should delete profile successfully', async () => {
      commandBus.execute.mockResolvedValue(undefined);

      await controller.deleteProfile('s-1');

      expect(commandBus.execute).toHaveBeenCalled();
    });

    it('should throw NotFoundException if delete fails with DomainException', async () => {
      commandBus.execute.mockRejectedValue(new DomainException('Not found'));

      await expect(controller.deleteProfile('s-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('registerAttendance', () => {
    it('should register attendance record', async () => {
      const record = {
        id: 'r-1',
        staffId: 's-1',
        type: 'entry',
        timestamp: new Date(),
        delayMinutes: 0,
        fineAmount: 0.0,
        method: 'FACIAL',
      };
      commandBus.execute.mockResolvedValue(record);

      const result = await controller.registerAttendance({
        staffId: 's-1',
        type: 'entry',
        method: 'FACIAL',
      });

      expect(result).toBeInstanceOf(AttendanceRecordEntity);
      expect(result.id).toBe('r-1');
    });

    it('should throw BadRequestException if register fails with DomainException', async () => {
      commandBus.execute.mockRejectedValue(new DomainException('Bad request'));

      await expect(
        controller.registerAttendance({
          staffId: 's-1',
          type: 'entry',
          method: 'FACIAL',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAttendance', () => {
    it('should return attendance records', async () => {
      queryBus.execute.mockResolvedValue([{ id: 'r-1' }]);

      const result = await controller.getAttendance('s-1');

      expect(result).toHaveLength(1);
    });
  });

  describe('getRules', () => {
    it('should return attendance rules', async () => {
      queryBus.execute.mockResolvedValue({
        id: 'rule-1',
        gracePeriodMinutes: 5,
        finePerMinute: 0.5,
      });

      const result = await controller.getRules();

      expect(result).toBeInstanceOf(AttendanceRuleEntity);
    });
  });

  describe('updateRules', () => {
    it('should update rules successfully', async () => {
      commandBus.execute.mockResolvedValue({
        id: 'rule-1',
        gracePeriodMinutes: 10,
        finePerMinute: 0.8,
      });

      const result = await controller.updateRules({
        gracePeriodMinutes: 10,
        finePerMinute: 0.8,
      });

      expect(result.gracePeriodMinutes).toBe(10);
    });
  });
});
