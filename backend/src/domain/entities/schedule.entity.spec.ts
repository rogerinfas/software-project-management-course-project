import { ScheduleEntity } from './schedule.entity';

describe('ScheduleEntity', () => {
  it('should create a ScheduleEntity instance and populate fields', () => {
    const data = {
      id: 'sched-1',
      sectionId: 'sec-123',
      courseId: 'course-123',
      staffId: 'staff-123',
      day: 1,
      startTime: '08:00',
      endTime: '09:30',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new ScheduleEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.sectionId).toBe(data.sectionId);
    expect(entity.courseId).toBe(data.courseId);
    expect(entity.staffId).toBe(data.staffId);
    expect(entity.day).toBe(data.day);
    expect(entity.startTime).toBe(data.startTime);
    expect(entity.endTime).toBe(data.endTime);
  });
});
