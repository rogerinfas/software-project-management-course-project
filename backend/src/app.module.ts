import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { AdmissionModule } from './admission.module';
import { EnrollmentModule } from './enrollment.module';

@Module({
  imports: [UserModule, AuthModule, AdmissionModule, EnrollmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
