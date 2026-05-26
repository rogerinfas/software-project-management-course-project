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
      provide: 'IStaffProfileRepository',
      useClass: PrismaStaffProfileRepository,
    },
    {
      provide: 'IAttendanceRecordRepository',
      useClass: PrismaAttendanceRecordRepository,
    },
    {
      provide: 'IAttendanceRuleRepository',
      useClass: PrismaAttendanceRuleRepository,
    },
    ...StaffCommandHandlers,
    ...StaffQueryHandlers,
  ],
  exports: [CqrsModule],
})
export class StaffModule {}
