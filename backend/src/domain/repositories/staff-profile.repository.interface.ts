import { StaffProfileEntity } from '../entities/staff-profile.entity';

export abstract class IStaffProfileRepository {
  abstract create(staff: Partial<StaffProfileEntity>): Promise<StaffProfileEntity>;
  abstract findById(id: string): Promise<StaffProfileEntity | null>;
  abstract findByUserId(userId: string): Promise<StaffProfileEntity | null>;
  abstract update(id: string, staff: Partial<StaffProfileEntity>): Promise<StaffProfileEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<StaffProfileEntity[]>;
}
