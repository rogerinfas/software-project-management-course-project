import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdmissionController } from './presentation/controllers/admission/admission.controller';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

// Repositories
import { PrismaAdmissionStageRepository } from './infrastructure/persistence/prisma/repositories/prisma-admission-stage.repository';
import { PrismaProspectRepository } from './infrastructure/persistence/prisma/repositories/prisma-prospect.repository';
import { PrismaAppointmentRepository } from './infrastructure/persistence/prisma/repositories/prisma-appointment.repository';
import { PrismaEvaluationResultRepository } from './infrastructure/persistence/prisma/repositories/prisma-evaluation-result.repository';

// Handlers
import { StageCommandHandlers } from './application/use-cases/admission-stage/commands';
import { StageQueryHandlers } from './application/use-cases/admission-stage/queries';
import { ProspectCommandHandlers } from './application/use-cases/prospect/commands';
import { AppointmentCommandHandlers } from './application/use-cases/appointment/commands';
import { AppointmentQueryHandlers } from './application/use-cases/appointment/queries';
import { EvaluationCommandHandlers } from './application/use-cases/evaluation-result/commands';

@Module({
  imports: [CqrsModule],
  controllers: [AdmissionController],
  providers: [
    PrismaService,
    {
      provide: 'IAdmissionStageRepository',
      useClass: PrismaAdmissionStageRepository,
    },
    {
      provide: 'IProspectRepository',
      useClass: PrismaProspectRepository,
    },
    {
      provide: 'IAppointmentRepository',
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: 'IEvaluationResultRepository',
      useClass: PrismaEvaluationResultRepository,
    },
    ...StageCommandHandlers,
    ...StageQueryHandlers,
    ...ProspectCommandHandlers,
    ...AppointmentCommandHandlers,
    ...AppointmentQueryHandlers,
    ...EvaluationCommandHandlers,
  ],
  exports: [CqrsModule],
})
export class AdmissionModule {}
