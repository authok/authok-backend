import {
  ITicket,
  IExpirationPolicy,
} from 'libs/api/ticket-api/src/ticket.interface';
import { ExpirationPolicy } from './expiration-policy.dto';

export class Ticket implements ITicket {
  id: string;

  prefix: string;

  countOfUses: number;

  createdAt: Date;

  expired: boolean;

  expirationPolicy: IExpirationPolicy;

  lastTimeUsed: Date;

  payload: any;

  constructor(props?) {
    if (!props) return;

    this.id = props.id;
    this.prefix = props.prefix;
    this.countOfUses = props.countOfUses;
    this.createdAt = new Date(props.createdAt);
    this.expired = props.expired;
    this.expirationPolicy = new ExpirationPolicy(props.expirationPolicy);
    this.payload = props.payload;
  }

  isExpired(): boolean {
    return this.expired || this.expirationPolicy.isExpired(this);
  }

  markTicketExpired() {
    this.expired = true;
  }

  update() {
    this.lastTimeUsed = new Date();
    this.countOfUses++;
  }
}
