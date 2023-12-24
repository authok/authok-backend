import { IMailSender } from 'libs/core/notifications-core/src/mail/mail-sender.interface';
import { Injectable } from '@nestjs/common';
import { Mail } from 'libs/core/notifications-core/src/mail/mail';

@Injectable()
export class CloudNativeMailSender implements IMailSender {
  async send(mail: Mail): Promise<boolean> {
    // TODO
    console.log('发送邮件: ', mail);

    return false;
  }
}
