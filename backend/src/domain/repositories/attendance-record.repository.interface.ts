import { AttendanceRecordEntity } from '../entities/attendance-record.entity';

export abstract class IAttendanceRecordRepository {
  abstract create(record: Partial<AttendanceRecordEntity>): Promise<AttendanceRecordEntity>;
  abstract findById(id: string): Promise<AttendanceRecordEntity | null>;
  abstract findByStaffId(staffId: string): Promise<AttendanceRecordEntity[]>;
  abstract update(id: string, record: Partial<AttendanceRecordEntity>): Promise<AttendanceRecordEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<AttendanceRecordEntity[]>;
}
