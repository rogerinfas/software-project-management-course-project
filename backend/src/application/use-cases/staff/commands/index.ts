import {
  CreateStaffProfileCommandHandler,
  UpdateStaffProfileCommandHandler,
  DeleteStaffProfileCommandHandler,
  RegisterAttendanceCommandHandler,
  UpdateAttendanceRulesCommandHandler,
} from './staff.commands';

export * from './staff.commands';

export const StaffCommandHandlers = [
  CreateStaffProfileCommandHandler,
  UpdateStaffProfileCommandHandler,
  DeleteStaffProfileCommandHandler,
  RegisterAttendanceCommandHandler,
  UpdateAttendanceRulesCommandHandler,
];
