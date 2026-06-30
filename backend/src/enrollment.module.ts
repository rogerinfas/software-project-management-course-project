import {
  GUARDIAN_REPOSITORY,
  STUDENT_REPOSITORY,
  ENROLLMENT_REPOSITORY,
  SECTION_REPOSITORY,
  PROSPECT_REPOSITORY,
} from './config/constants/tokens';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EnrollmentController } from './presentation/controllers/enrollment/enrollment.controller';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

// Repositories
import { PrismaGuardianRepository } from './infrastructure/persistence/prisma/repositories/prisma-guardian.repository';
import { PrismaStudentRepository } from './infrastructure/persistence/prisma/repositories/prisma-student.repository';
import { PrismaEnrollmentRepository } from './infrastructure/persistence/prisma/repositories/prisma-enrollment.repository';
import { PrismaSectionRepository } from './infrastructure/persistence/prisma/repositories/prisma-section.repository';
import { PrismaProspectRepository } from './infrastructure/persistence/prisma/repositories/prisma-prospect.repository';

// Handlers
import { EnrollmentCommandHandlers } from './application/use-cases/enrollment/commands';
import { EnrollmentQueryHandlers } from './application/use-cases/enrollment/queries';

@Module({
  imports: [CqrsModule],
  controllers: [EnrollmentController],
  providers: [
    PrismaService,
    {
      provide: GUARDIAN_REPOSITORY,
      useClass: PrismaGuardianRepository,
    },
    {
      provide: STUDENT_REPOSITORY,
      useClass: PrismaStudentRepository,
    },
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: PrismaEnrollmentRepository,
    },
    {
      provide: SECTION_REPOSITORY,
      useClass: PrismaSectionRepository,
    },
    {
      provide: PROSPECT_REPOSITORY,
      useClass: PrismaProspectRepository,
    },
    ...EnrollmentCommandHandlers,
    ...EnrollmentQueryHandlers,
  ],
  exports: [CqrsModule],
})
export class EnrollmentModule {}
