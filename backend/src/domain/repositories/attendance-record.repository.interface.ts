import { AttendanceRecordEntity } from '../entities/attendance-record.entity';

export interface IAttendanceRecordRepository {
  create(
    record: Partial<AttendanceRecordEntity>,
  ): Promise<AttendanceRecordEntity>;
  findById(id: string): Promise<AttendanceRecordEntity | null>;
  findByStaffId(staffId: string): Promise<AttendanceRecordEntity[]>;
  update(
    id: string,
    record: Partial<AttendanceRecordEntity>,
  ): Promise<AttendanceRecordEntity>;
  delete(id: string): Promise<void>;
  findAll(): Promise<AttendanceRecordEntity[]>;
}
