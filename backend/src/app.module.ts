import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { AdmissionModule } from './admission.module';
import { EnrollmentModule } from './enrollment.module';
import { AcademicModule } from './academic.module';
import { TreasuryModule } from './treasury.module';
import { StaffModule } from './staff.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    AdmissionModule,
    EnrollmentModule,
    AcademicModule,
    TreasuryModule,
    StaffModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
