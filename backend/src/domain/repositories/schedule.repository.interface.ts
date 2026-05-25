import { ScheduleEntity } from '../entities/schedule.entity';

export abstract class IScheduleRepository {
  abstract create(schedule: Partial<ScheduleEntity>): Promise<ScheduleEntity>;
  abstract findById(id: string): Promise<ScheduleEntity | null>;
  abstract update(id: string, schedule: Partial<ScheduleEntity>): Promise<ScheduleEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findBySection(sectionId: string): Promise<ScheduleEntity[]>;
  abstract findByTeacher(staffId: string): Promise<ScheduleEntity[]>;
  abstract checkConflicts(
    day: number,
    startTime: string,
    endTime: string,
    sectionId: string,
    staffId: string,
    excludeId?: string,
  ): Promise<ScheduleEntity[]>;
  abstract findAll(): Promise<ScheduleEntity[]>;
}
