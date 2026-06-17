import {
  CreateScheduleCommand,
  CreateScheduleCommandHandler,
  UpdateScheduleCommand,
  UpdateScheduleCommandHandler,
  DeleteScheduleCommand,
  DeleteScheduleCommandHandler,
} from './schedule.commands';
import { ScheduleEntity } from '../../../../domain/entities/schedule.entity';
import {
  ScheduleNotFoundException,
  ScheduleConflictException,
  CourseNotFoundException,
} from '../../../../domain/exceptions/academic-domain.exceptions';
import { SectionNotFoundException } from '../../../../domain/exceptions/enrollment-domain.exceptions';

describe('Schedule Commands', () => {
  let scheduleRepository: any;
  let sectionRepository: any;
  let courseRepository: any;

  beforeEach(() => {
    scheduleRepository = {
      findById: jest.fn(),
      checkConflicts: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    sectionRepository = {
      findById: jest.fn(),
    };
    courseRepository = {
      findById: jest.fn(),
    };
  });

  describe('CreateScheduleCommandHandler', () => {
    it('should throw SectionNotFoundException if section not found', async () => {
      sectionRepository.findById.mockResolvedValue(null);
      const handler = new CreateScheduleCommandHandler(scheduleRepository, sectionRepository, courseRepository);
      const command = new CreateScheduleCommand('s-1', 'c-1', 'staff-1', 1, '08:00', '10:00');

      await expect(handler.execute(command)).rejects.toThrow(SectionNotFoundException);
    });

    it('should throw CourseNotFoundException if course not found', async () => {
      sectionRepository.findById.mockResolvedValue({});
      courseRepository.findById.mockResolvedValue(null);
      const handler = new CreateScheduleCommandHandler(scheduleRepository, sectionRepository, courseRepository);
      const command = new CreateScheduleCommand('s-1', 'c-1', 'staff-1', 1, '08:00', '10:00');

      await expect(handler.execute(command)).rejects.toThrow(CourseNotFoundException);
    });

    it('should throw ScheduleConflictException if section conflict exists', async () => {
      sectionRepository.findById.mockResolvedValue({});
      courseRepository.findById.mockResolvedValue({});
      scheduleRepository.checkConflicts.mockResolvedValue([{ sectionId: 's-1', staffId: 'other-staff' }]);

      const handler = new CreateScheduleCommandHandler(scheduleRepository, sectionRepository, courseRepository);
      const command = new CreateScheduleCommand('s-1', 'c-1', 'staff-1', 1, '08:00', '10:00');

      await expect(handler.execute(command)).rejects.toThrow(ScheduleConflictException);
    });

    it('should throw ScheduleConflictException if teacher conflict exists', async () => {
      sectionRepository.findById.mockResolvedValue({});
      courseRepository.findById.mockResolvedValue({});
      scheduleRepository.checkConflicts.mockResolvedValue([{ sectionId: 'other-section', staffId: 'staff-1' }]);

      const handler = new CreateScheduleCommandHandler(scheduleRepository, sectionRepository, courseRepository);
      const command = new CreateScheduleCommand('s-1', 'c-1', 'staff-1', 1, '08:00', '10:00');

      await expect(handler.execute(command)).rejects.toThrow(ScheduleConflictException);
    });

    it('should create schedule successfully', async () => {
      sectionRepository.findById.mockResolvedValue({});
      courseRepository.findById.mockResolvedValue({});
      scheduleRepository.checkConflicts.mockResolvedValue([]);
      const created = new ScheduleEntity({
        id: 'sch-1',
        sectionId: 's-1',
        courseId: 'c-1',
        staffId: 'staff-1',
        day: 1,
        startTime: '08:00',
        endTime: '10:00',
      });
      scheduleRepository.create.mockResolvedValue(created);

      const handler = new CreateScheduleCommandHandler(scheduleRepository, sectionRepository, courseRepository);
      const command = new CreateScheduleCommand('s-1', 'c-1', 'staff-1', 1, '08:00', '10:00');
      const result = await handler.execute(command);

      expect(result).toBe(created);
    });
  });

  describe('UpdateScheduleCommandHandler', () => {
    it('should throw ScheduleNotFoundException if schedule not found', async () => {
      scheduleRepository.findById.mockResolvedValue(null);
      const handler = new UpdateScheduleCommandHandler(scheduleRepository, sectionRepository, courseRepository);
      const command = new UpdateScheduleCommand('non-existent-id');

      await expect(handler.execute(command)).rejects.toThrow(ScheduleNotFoundException);
    });
  });

  describe('DeleteScheduleCommandHandler', () => {
    it('should throw ScheduleNotFoundException if not found', async () => {
      scheduleRepository.findById.mockResolvedValue(null);
      const handler = new DeleteScheduleCommandHandler(scheduleRepository);
      const command = new DeleteScheduleCommand('non-existent-id');

      await expect(handler.execute(command)).rejects.toThrow(ScheduleNotFoundException);
    });

    it('should delete schedule if found', async () => {
      scheduleRepository.findById.mockResolvedValue({});
      const handler = new DeleteScheduleCommandHandler(scheduleRepository);
      const command = new DeleteScheduleCommand('sch-1');
      await handler.execute(command);

      expect(scheduleRepository.delete).toHaveBeenCalledWith('sch-1');
    });
  });
});
