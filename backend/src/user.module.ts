import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './presentation/controllers/user/user.controller';
import { PrismaUserRepository } from './infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { SeedService } from './infrastructure/seed/seed.service';
import { CommandHandlers } from './application/use-cases/user/commands';
import { QueryHandlers } from './application/use-cases/user/queries';

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    SeedService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [CqrsModule],
})
export class UserModule {}
