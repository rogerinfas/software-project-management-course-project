import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Role } from '@prisma/client';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserCommand } from '../../application/use-cases/user/commands/create-user.command';
import { GetUserByEmailQuery } from '../../application/use-cases/user/queries/get-user-by-email.query';
import 'dotenv/config';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('🚀 Iniciando inicialización de usuarios base...');

    const rolesToSeed = [
      { role: Role.ADMIN, prefix: 'ADMIN' },
      { role: Role.TEACHER, prefix: 'TEACHER' },
      { role: Role.STAFF, prefix: 'STAFF' },
      { role: Role.ADMISSION, prefix: 'ADMISSION' },
      { role: Role.TREASURY, prefix: 'TREASURY' },
    ];

    for (const item of rolesToSeed) {
      const email = process.env[`${item.prefix}_EMAIL`];
      const password = process.env[`${item.prefix}_PASSWORD`];

      if (email && password) {
        await this.ensureUserExists(email, password, item.role);
      } else {
        this.logger.warn(
          `⚠️ Credenciales no configuradas para el rol ${item.role}, omitiendo.`,
        );
      }
    }

    this.logger.log('✅ Inicialización de usuarios finalizada.');
  }

  private async tryFindUserByEmail(email: string) {
    try {
      return await this.queryBus.execute(new GetUserByEmailQuery(email));
    } catch {
      return null;
    }
  }

  private async ensureUserExists(email: string, password: string, role: Role) {
    const existingUser = await this.tryFindUserByEmail(email);

    if (!existingUser) {
      this.logger.log(`👤 Creando usuario para el rol ${role}: ${email}`);
      const entity = new UserEntity({
        email,
        emailVerified: true,
        role,
        name: `Default ${role.charAt(0) + role.slice(1).toLowerCase()}`,
      });
      await this.commandBus.execute(new CreateUserCommand(entity, password));
    } else {
      this.logger.log(`✅ Usuario ${role} ya existe: ${email}`);
    }
  }
}
