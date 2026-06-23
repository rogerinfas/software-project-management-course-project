import {
  PROSPECT_REPOSITORY,
  APPOINTMENT_REPOSITORY,
  EVALUATION_RESULT_REPOSITORY,
  PROSPECT_INTERACTION_REPOSITORY,
} from './config/constants/tokens';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdmissionController } from './presentation/controllers/admission/admission.controller';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

// Repositories
import { PrismaProspectRepository } from './infrastructure/persistence/prisma/repositories/prisma-prospect.repository';
import { PrismaAppointmentRepository } from './infrastructure/persistence/prisma/repositories/prisma-appointment.repository';
import { PrismaEvaluationResultRepository } from './infrastructure/persistence/prisma/repositories/prisma-evaluation-result.repository';
import { PrismaProspectInteractionRepository } from './infrastructure/persistence/prisma/repositories/prisma-interaction.repository';

// Handlers
import { ProspectCommandHandlers } from './application/use-cases/prospect/commands';
import { ProspectQueryHandlers } from './application/use-cases/prospect/queries/get-prospects-paginated.query';
import { AppointmentCommandHandlers } from './application/use-cases/appointment/commands';
import { AppointmentQueryHandlers } from './application/use-cases/appointment/queries';
import { EvaluationCommandHandlers } from './application/use-cases/evaluation-result/commands';
import {
  InteractionCommandHandlers,
  InteractionQueryHandlers,
} from './application/use-cases/interaction';

@Module({
  imports: [CqrsModule],
  controllers: [AdmissionController],
  providers: [
    PrismaService,
    {
      provide: PROSPECT_REPOSITORY,
      useClass: PrismaProspectRepository,
    },
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: EVALUATION_RESULT_REPOSITORY,
      useClass: PrismaEvaluationResultRepository,
    },
    {
      provide: PROSPECT_INTERACTION_REPOSITORY,
      useClass: PrismaProspectInteractionRepository,
    },
    ...ProspectCommandHandlers,
    ...ProspectQueryHandlers,
    ...AppointmentCommandHandlers,
    ...AppointmentQueryHandlers,
    ...EvaluationCommandHandlers,
    ...InteractionCommandHandlers,
    ...InteractionQueryHandlers,
  ],
  exports: [CqrsModule],
})
export class AdmissionModule {}
