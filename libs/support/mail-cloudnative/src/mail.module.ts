import { Global, Module } from '@nestjs/common';
import { CloudNativeMailSender } from './mail.sender';

@Global()
@Module({
  providers: [
    {
      provide: 'IMailSender',
      useClass: CloudNativeMailSender,
    },
  ],
  exports: ['IMailSender'],
})
export class CloudNativeMailModule {}
