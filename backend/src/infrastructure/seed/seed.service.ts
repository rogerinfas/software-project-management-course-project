import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { Role } from '@prisma/client';
import 'dotenv/config';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly userService: UserService) {}

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
      return await this.userService.getUserByEmail(email);
    } catch {
      return null;
    }
  }

  private async ensureUserExists(email: string, password: string, role: Role) {
    const existingUser = await this.tryFindUserByEmail(email);

    if (!existingUser) {
      this.logger.log(`👤 Creando usuario para el rol ${role}: ${email}`);
      await this.userService.createUser({
        email,
        password, // In a real app, this would be hashed
        role,
        name: `Default ${role.charAt(0) + role.slice(1).toLowerCase()}`,
      });
    } else {
      this.logger.log(`✅ Usuario ${role} ya existe: ${email}`);
    }
  }
}
