import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EnrollmentController } from './presentation/controllers/enrollment/enrollment.controller';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

// Repositories
import { PrismaGuardianRepository } from './infrastructure/persistence/prisma/repositories/prisma-guardian.repository';
import { PrismaStudentRepository } from './infrastructure/persistence/prisma/repositories/prisma-student.repository';
import { PrismaEnrollmentRepository } from './infrastructure/persistence/prisma/repositories/prisma-enrollment.repository';
import { PrismaSectionRepository } from './infrastructure/persistence/prisma/repositories/prisma-section.repository';

// Handlers
import { EnrollmentCommandHandlers } from './application/use-cases/enrollment/commands';
import { EnrollmentQueryHandlers } from './application/use-cases/enrollment/queries';

@Module({
  imports: [CqrsModule],
  controllers: [EnrollmentController],
  providers: [
    PrismaService,
    {
      provide: 'IGuardianRepository',
      useClass: PrismaGuardianRepository,
    },
    {
      provide: 'IStudentRepository',
      useClass: PrismaStudentRepository,
    },
    {
      provide: 'IEnrollmentRepository',
      useClass: PrismaEnrollmentRepository,
    },
    {
      provide: 'ISectionRepository',
      useClass: PrismaSectionRepository,
    },
    ...EnrollmentCommandHandlers,
    ...EnrollmentQueryHandlers,
  ],
  exports: [CqrsModule],
})
export class EnrollmentModule {}
