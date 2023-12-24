import {
  ITicket,
  ITicketIdGenerator,
  ITicketFactory,
} from 'libs/api/ticket-api/src';
import { Ticket } from './ticket.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ExpirationPolicy } from './expiration-policy.dto';

@Injectable()
export class TicketFactory implements ITicketFactory {
  constructor(
    @Inject('ITicketIdGenerator')
    private readonly ticketIdGenerator: ITicketIdGenerator,
  ) {}

  async create(prefix: string, payload?: any): Promise<ITicket> {
    const expirationPolicy = new ExpirationPolicy({
      timeToLive: 60 * 1,
      maxCountOfUses: 1,
    });

    const id = await this.ticketIdGenerator.getNewTicketId();
    return new Ticket({
      id,
      prefix,
      createdAt: new Date(),
      countOfUses: 0,
      expirationPolicy,
      payload,
    });
  }
}
