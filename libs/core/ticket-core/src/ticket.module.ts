import { Module, Global } from '@nestjs/common';

import { DefaultTicketIdGenerator } from 'libs/core/ticket-core/src/ticket-id.generator';
import { TicketFactory } from 'libs/core/ticket-core/src/ticket.factory';

@Global()
@Module({
  providers: [
    {
      provide: 'ITicketIdGenerator',
      useClass: DefaultTicketIdGenerator,
    },
    {
      provide: 'ITicketFactory',
      useClass: TicketFactory,
    },
  ],
  exports: ['ITicketIdGenerator', 'ITicketFactory'],
})
export class TicketModule {}
