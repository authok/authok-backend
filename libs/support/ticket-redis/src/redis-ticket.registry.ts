import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { RedisService } from '@authok/nestjs-redis';
import { ITicket, ITicketRegistry } from 'libs/api/ticket-api/src';
import { Ticket } from 'libs/core/ticket-core/src/ticket.dto';

@Injectable()
export class RedisTicketRegistry implements ITicketRegistry {
  private client: any;

  constructor(private redisService: RedisService) {
    this.getClient();
  }

  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  private key(service: string, id: string): string {
    return `ticket--${service}-${id}`;
  }

  async add(ticket: ITicket) {
    await this.client.set(
      this.key(ticket.prefix, ticket.id),
      JSON.stringify(ticket),
      'EX',
      ticket.expirationPolicy.timeToLive || 3600,
    );
  }

  async get(service: string, ticketId: string): Promise<ITicket | undefined> {
    const data = await this.client.get(this.key(service, ticketId));
    if (data) {
      const _ticketProps = JSON.parse(data);
      return new Ticket(_ticketProps);
    } else {
      return null;
    }
  }

  async delete(service: string, ticketId: string): Promise<number | undefined> {
    Logger.debug(`删除ticket, service: ${service}, ticket: ${ticketId}`);
    const r = await this.client.del(this.key(service, ticketId));
    return r;
  }

  async update(ticket: ITicket) {
    const result = await this.client.get(this.key(ticket.prefix, ticket.id));
    if (!result) {
      throw new NotFoundException(
        `ticket(prefix: ${ticket.prefix}, id: ${ticket.id}) not found`,
      );
    }

    await this.client.set(
      this.key(ticket.prefix, ticket.id),
      JSON.stringify(ticket),
      'EX',
      ticket.expirationPolicy.timeToIdle,
    );
  }
}
