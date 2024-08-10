import { Injectable, Inject } from '@nestjs/common';
import { Mail } from './mail/mail';
import { IMailSender } from './mail/mail-sender.interface';
import { ISmsSender } from './sms/sms-sender.interface';
import { IRequestContext } from '@libs/nest-core';

@Injectable()
export class NotificationManager {
  constructor(
    @Inject('ISmsSender')
    private readonly smsSender: ISmsSender,
    @Inject('IMailSender')
    private readonly mailSender: IMailSender,
  ) {}

  async sendPasswordResetConfirmationEmail(toEmail: string) {
    const mail = new Mail()
      .from('"GISC Accounts Team" <giscaccounts@tamu.edu>')
      .to(`${toEmail},`)
      .subject('密码重置')
      .text('您的密码已被重置.')
      .html('您的密码已被重置.');

    await this.mailSender.send(mail);
  }

  async sendAccountConfirmationEmail(ctx: IRequestContext, to: string, sub: string) {
    const mail = new Mail()
      .from('"GISC Accounts Team" <giscaccounts@tamu.edu>')
      .to(to)
      .subject('Your newly created GeoInnovation Service Center account')
      .text(
        'An account for GeoInnovation Service Center has been created with this email address.',
      )
      .html(
        `An account for GeoInnovation Service Center has been created with this email address. </br><a href="http://localhost:4001/user/register/${sub}">Verify email</a>`,
      );

    await this.mailSender.send(mail);
  }
}
