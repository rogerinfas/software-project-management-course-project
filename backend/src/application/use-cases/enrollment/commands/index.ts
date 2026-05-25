import { CreateGuardianCommandHandler } from './create-guardian.command';
import { UpdateGuardianCommandHandler } from './update-guardian.command';
import { DeleteGuardianCommandHandler } from './delete-guardian.command';
import { FormalizeEnrollmentCommandHandler } from './formalize-enrollment.command';

export const EnrollmentCommandHandlers = [
  CreateGuardianCommandHandler,
  UpdateGuardianCommandHandler,
  DeleteGuardianCommandHandler,
  FormalizeEnrollmentCommandHandler,
];
