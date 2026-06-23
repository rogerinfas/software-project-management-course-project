import { ScheduleEntity } from '../entities/schedule.entity';

export interface IScheduleRepository {
  create(schedule: Partial<ScheduleEntity>): Promise<ScheduleEntity>;
  findById(id: string): Promise<ScheduleEntity | null>;
  update(
    id: string,
    schedule: Partial<ScheduleEntity>,
  ): Promise<ScheduleEntity>;
  delete(id: string): Promise<void>;
  findBySection(sectionId: string): Promise<ScheduleEntity[]>;
  findByTeacher(staffId: string): Promise<ScheduleEntity[]>;
  checkConflicts(
    day: number,
    startTime: string,
    endTime: string,
    sectionId: string,
    staffId: string,
    excludeId?: string,
  ): Promise<ScheduleEntity[]>;
  findAll(): Promise<ScheduleEntity[]>;
}
