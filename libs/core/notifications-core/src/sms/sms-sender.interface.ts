import { ISms } from './sms';

export interface ISmsSender {
  send(ctx: Record<string, any>, sms: ISms): Promise<boolean>;
}
