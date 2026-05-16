import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './infrastructure/config/better-auth/better-auth.config';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: false, // Protege todas las rutas por defecto
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
