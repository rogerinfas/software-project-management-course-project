import { GetGuardiansQueryHandler } from './get-guardians.query';
import { GetStudentsQueryHandler } from './get-students.query';
import { GetSectionsQueryHandler } from './get-sections.query';
import { GetEnrollmentDocumentsQueryHandler } from './get-enrollment-documents.query';

export const EnrollmentQueryHandlers = [
  GetGuardiansQueryHandler,
  GetStudentsQueryHandler,
  GetSectionsQueryHandler,
  GetEnrollmentDocumentsQueryHandler,
];
