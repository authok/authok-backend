import { ITicket } from './ticket.interface';

export interface ITicketRegistry {
  add(ticket: ITicket);

  get(service: string, ticketId: string): Promise<ITicket | undefined>;

  delete(service: string, ticketId: string): Promise<number | undefined>;

  update(ticket: ITicket);
}
