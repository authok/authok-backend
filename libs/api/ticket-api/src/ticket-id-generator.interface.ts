export interface ITicketIdGenerator {
  getNewTicketId(): Promise<string | undefined>;
}
