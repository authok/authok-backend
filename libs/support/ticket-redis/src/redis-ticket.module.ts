import { Module, Global } from '@nestjs/common';

import { RedisTicketRegistry } from './redis-ticket.registry';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'ITicketRegistry',
      useClass: RedisTicketRegistry,
    },
  ],
  exports: ['ITicketRegistry'],
})
export class RedisTicketModule {}
