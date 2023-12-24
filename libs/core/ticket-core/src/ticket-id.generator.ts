import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { ITicketIdGenerator } from 'libs/api/ticket-api/src';

@Injectable()
export class DefaultTicketIdGenerator implements ITicketIdGenerator {
  async getNewTicketId(): Promise<string | undefined> {
    return await uuid.v4();
  }
}
