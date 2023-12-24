import { Global, Module } from '@nestjs/common';
import { NodeMailerMailSender } from './mail.sender';

@Global()
@Module({
  providers: [
    {
      provide: 'IMailSender',
      useClass: NodeMailerMailSender,
    },
  ],
  exports: ['IMailSender'],
})
export class NodeMailerMailModule {}
