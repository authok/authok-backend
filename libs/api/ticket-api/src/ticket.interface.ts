export interface IExpirationPolicy {
  maxCountOfUses: number;
  timeToLive: number; // second
  timeToIdle: number; // second
  isExpired(ticket: ITicket): boolean;
}

export interface ITicket {
  id: string;

  prefix: string;

  countOfUses: number;

  createdAt: Date;

  expirationPolicy: IExpirationPolicy;

  payload: any;

  isExpired(): boolean;

  markTicketExpired();

  update();
}
