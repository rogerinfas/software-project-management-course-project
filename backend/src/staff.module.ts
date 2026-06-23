import { STAFF_PROFILE_REPOSITORY, ATTENDANCE_RECORD_REPOSITORY, ATTENDANCE_RULE_REPOSITORY } from './config/constants/tokens';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StaffController } from './presentation/controllers/staff/staff.controller';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

// Repositories
import { PrismaStaffProfileRepository } from './infrastructure/persistence/prisma/repositories/prisma-staff-profile.repository';
import { PrismaAttendanceRecordRepository } from './infrastructure/persistence/prisma/repositories/prisma-attendance-record.repository';
import { PrismaAttendanceRuleRepository } from './infrastructure/persistence/prisma/repositories/prisma-attendance-rule.repository';

// CQRS Handlers
import { StaffCommandHandlers } from './application/use-cases/staff/commands';
import { StaffQueryHandlers } from './application/use-cases/staff/queries';

@Module({
  imports: [CqrsModule],
  controllers: [StaffController],
  providers: [
    PrismaService,
    {
      provide: STAFF_PROFILE_REPOSITORY,
      useClass: PrismaStaffProfileRepository,
    },
    {
      provide: ATTENDANCE_RECORD_REPOSITORY,
      useClass: PrismaAttendanceRecordRepository,
    },
    {
      provide: ATTENDANCE_RULE_REPOSITORY,
      useClass: PrismaAttendanceRuleRepository,
    },
    ...StaffCommandHandlers,
    ...StaffQueryHandlers,
  ],
  exports: [CqrsModule],
})
export class StaffModule {}
