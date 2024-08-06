import { Module, Global } from '@nestjs/common';

import { RedisTicketModule } from 'libs/support/ticket-redis/src/redis-ticket.module';
import { PasswordlessSupportModule } from 'libs/support/passwordless/src/passwordless.module';
import { CloudNativeSmsModule } from 'libs/support/sms-cloudnative/src/sms.module';
import { VM2SandboxModule } from 'libs/support/sandbox-vm2/src/vm2.sandbox.module';
import { IPModule } from 'libs/support/ipservice-support/src/ip.module';
import { NodeMailerMailModule } from 'libs/support/mail-nodemailer/src/mail.module';
import { TypeOrmLogModule } from 'libs/support/logstream-typeorm/src/log.module';
import { LoggingClientModule } from 'libs/client/logging/src/logging-client.module';

@Global()
@Module({
  imports: [
    // TypeOrmLogModule,
    LoggingClientModule,
    RedisTicketModule,
    PasswordlessSupportModule,
    CloudNativeSmsModule,
    // CloudNativeMailModule,
    NodeMailerMailModule,
    VM2SandboxModule,
    IPModule,
  ],
})
export class SupportModule {}
