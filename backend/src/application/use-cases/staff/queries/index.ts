import {
  GetStaffProfilesQueryHandler,
  GetStaffProfileByIdQueryHandler,
  GetAttendanceRecordsQueryHandler,
  GetAttendanceRuleQueryHandler,
} from './staff.queries';

export * from './staff.queries';

export const StaffQueryHandlers = [
  GetStaffProfilesQueryHandler,
  GetStaffProfileByIdQueryHandler,
  GetAttendanceRecordsQueryHandler,
  GetAttendanceRuleQueryHandler,
];
