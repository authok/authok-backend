import { IMailSender } from 'libs/core/notifications-core/src/mail/mail-sender.interface';
import { Injectable } from '@nestjs/common';
import { Mail } from 'libs/core/notifications-core/src/mail/mail';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodeMailerMailSender implements IMailSender {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mailer.host'),
      port: this.configService.get('mailer.port'),
      secure: this.configService.get('mailer.secure'),
      auth: {
        user: this.configService.get('mailer.auth.user'),
        pass: this.configService.get('mailer.auth.pass'),
      },
    });
  }

  async send(mail: Mail): Promise<boolean> {
    // TODO
    console.log('发送邮件: ', mail);

    const res = await this.transporter.sendMail({
      from: mail._from,
      to: mail._to,
      subject: mail._subject,
      text: mail._text,
      html: mail._html,
    });
    console.log('res', res);

    return false;
  }
}
