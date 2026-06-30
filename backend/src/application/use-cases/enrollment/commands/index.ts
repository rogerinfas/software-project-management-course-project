import { CreateGuardianCommandHandler } from './create-guardian.command';
import { UpdateGuardianCommandHandler } from './update-guardian.command';
import { DeleteGuardianCommandHandler } from './delete-guardian.command';
import { FormalizeEnrollmentCommandHandler } from './formalize-enrollment.command';
import { CreateStudentFromProspectCommandHandler } from './create-student-from-prospect.command';
import { AssignGuardianToStudentCommandHandler } from './assign-guardian-to-student.command';
import { EnrollStudentCommandHandler } from './enroll-student.command';

export const EnrollmentCommandHandlers = [
  CreateGuardianCommandHandler,
  UpdateGuardianCommandHandler,
  DeleteGuardianCommandHandler,
  FormalizeEnrollmentCommandHandler,
  CreateStudentFromProspectCommandHandler,
  AssignGuardianToStudentCommandHandler,
  EnrollStudentCommandHandler,
];
