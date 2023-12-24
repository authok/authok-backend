import { Global, Module } from '@nestjs/common';
import { CloudNativeSmsSender } from './sms.sender';

@Global()
@Module({
  providers: [
    {
      provide: 'ISmsSender',
      useClass: CloudNativeSmsSender,
    },
  ],
  exports: ['ISmsSender'],
})
export class CloudNativeSmsModule {}
