import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

// Controllers
import { TreasuryController } from './presentation/controllers/treasury/treasury.controller';

// Repositories
import { PrismaTariffRepository } from './infrastructure/persistence/prisma/repositories/prisma-tariff.repository';
import { PrismaChargeRepository } from './infrastructure/persistence/prisma/repositories/prisma-charge.repository';
import { PrismaPaymentRepository } from './infrastructure/persistence/prisma/repositories/prisma-payment.repository';

// CQRS Handlers
import { TreasuryCommandHandlers } from './application/use-cases/treasury/commands';
import { TreasuryQueryHandlers } from './application/use-cases/treasury/queries';

@Module({
  imports: [CqrsModule],
  controllers: [TreasuryController],
  providers: [
    PrismaService,
    {
      provide: 'ITariffRepository',
      useClass: PrismaTariffRepository,
    },
    {
      provide: 'IChargeRepository',
      useClass: PrismaChargeRepository,
    },
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
    ...TreasuryCommandHandlers,
    ...TreasuryQueryHandlers,
  ],
  exports: [CqrsModule],
})
export class TreasuryModule {}
