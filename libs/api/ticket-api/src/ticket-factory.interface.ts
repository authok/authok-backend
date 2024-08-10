import { ITicket } from './ticket.interface';

export interface ITicketFactory {
  create(prefix: string, payload?: any): Promise<ITicket>;
}
