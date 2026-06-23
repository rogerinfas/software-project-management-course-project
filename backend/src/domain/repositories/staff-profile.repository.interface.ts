import { StaffProfileEntity } from '../entities/staff-profile.entity';

export interface IStaffProfileRepository {
  create(
    staff: Partial<StaffProfileEntity>,
  ): Promise<StaffProfileEntity>;
  findById(id: string): Promise<StaffProfileEntity | null>;
  findByUserId(userId: string): Promise<StaffProfileEntity | null>;
  update(
    id: string,
    staff: Partial<StaffProfileEntity>,
  ): Promise<StaffProfileEntity>;
  delete(id: string): Promise<void>;
  findAll(): Promise<StaffProfileEntity[]>;
}
