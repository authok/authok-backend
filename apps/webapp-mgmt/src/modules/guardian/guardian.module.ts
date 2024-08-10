import { Module } from '@nestjs/common';
import { SharedModule } from 'libs/shared/src/shared.module';
import { GuardianController } from './guardian.controller';
import { PolicyController } from './policies.controller';
import { EnrollmentController } from './enrollment.controller';
import { SmsController } from './sms.controller';
import { PhoneController } from './phone.controller';

@Module({
  imports: [SharedModule],
  controllers: [
    GuardianController,
    PolicyController,
    EnrollmentController,
    PhoneController,
    SmsController,
  ],
  providers: [],
  exports: [],
})
export class GuardianModule {}
