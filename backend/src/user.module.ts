import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { PrismaUserRepository } from './infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { SeedService } from './infrastructure/seed/seed.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    SeedService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
