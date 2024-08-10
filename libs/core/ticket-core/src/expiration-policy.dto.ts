import { IExpirationPolicy, ITicket } from 'libs/api/ticket-api/src';
import { Logger } from '@nestjs/common';

export class ExpirationPolicy implements IExpirationPolicy {
  timeToLive: number;

  timeToIdle: number;

  maxCountOfUses: number;

  constructor(props) {
    if (!props) return;

    this.timeToLive = props.timeToLive;
    this.timeToIdle = props.timeToIdle;
    this.maxCountOfUses = props.maxCountOfUses;
  }

  isExpired(ticket: ITicket): boolean {
    if (ticket.countOfUses >= this.maxCountOfUses) {
      Logger.log(
        `ticket(id: ${ticket.id}) expired, countOfUses > ${this.maxCountOfUses}`,
      );
      return true;
    }

    const now = new Date();
    const duration = now.getTime() - ticket.createdAt.getTime();
    if (duration > this.timeToLive * 1000) {
      Logger.log(
        `ticket(id: ${ticket.id}, createdAt: ${ticket.createdAt}) expired, liveToNow: ${duration} > timeToLive: ${this.timeToLive}`,
      );
      return true;
    }

    // TODO timeToIdle

    return false;
  }
}
