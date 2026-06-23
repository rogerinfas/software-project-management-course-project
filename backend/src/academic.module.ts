import { COURSE_REPOSITORY, SCHEDULE_REPOSITORY, COMMUNICATION_REPOSITORY, SECTION_REPOSITORY } from './config/constants/tokens';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AcademicController } from './presentation/controllers/academic/academic.controller';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

// Repositories
import { PrismaCourseRepository } from './infrastructure/persistence/prisma/repositories/prisma-course.repository';
import { PrismaScheduleRepository } from './infrastructure/persistence/prisma/repositories/prisma-schedule.repository';
import { PrismaCommunicationRepository } from './infrastructure/persistence/prisma/repositories/prisma-communication.repository';
import { PrismaSectionRepository } from './infrastructure/persistence/prisma/repositories/prisma-section.repository';

// CQRS Handlers
import { AcademicCommandHandlers } from './application/use-cases/academic/commands';
import { AcademicQueryHandlers } from './application/use-cases/academic/queries';

@Module({
  imports: [CqrsModule],
  controllers: [AcademicController],
  providers: [
    PrismaService,
    {
      provide: COURSE_REPOSITORY,
      useClass: PrismaCourseRepository,
    },
    {
      provide: SCHEDULE_REPOSITORY,
      useClass: PrismaScheduleRepository,
    },
    {
      provide: COMMUNICATION_REPOSITORY,
      useClass: PrismaCommunicationRepository,
    },
    {
      provide: SECTION_REPOSITORY,
      useClass: PrismaSectionRepository,
    },
    ...AcademicCommandHandlers,
    ...AcademicQueryHandlers,
  ],
  exports: [CqrsModule],
})
export class AcademicModule {}
