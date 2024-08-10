import { Mail } from './mail';

export interface IMailSender {
  send(mail: Mail): Promise<boolean>;
}
