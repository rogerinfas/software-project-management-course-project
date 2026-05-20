import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { AdmissionModule } from './admission.module';

@Module({
  imports: [UserModule, AuthModule, AdmissionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
