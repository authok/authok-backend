import { Global, Module } from '@nestjs/common';
import { NotificationManager } from './notification.manager';

@Global()
@Module({
  providers: [NotificationManager],
  exports: [NotificationManager],
})
export class NotificationModule {}
