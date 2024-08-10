import * as consolidate from 'consolidate';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IMailer } from 'libs/api/infra-api/src';
import { Mail } from 'libs/core/notifications-core/src/mail/mail';
import { IMailSender } from 'libs/core/notifications-core/src/mail/mail-sender.interface';
import { IContext } from '@libs/nest-core';
import { EmailTemplateDto } from 'libs/dto/src';

@Injectable()
export class Mailer implements IMailer {
  constructor(
    @Inject('IMailSender')
    private readonly mailSender: IMailSender,
  ) {}

  async send(
    ctx: IContext,
    template: EmailTemplateDto,
    params: Record<string, any>,
    to: string,
  ) {
    const engineName = template.syntax || 'liquid';
    const engine = consolidate[engineName];
    if (!engine) {
      throw new NotFoundException(`Engine not found for name: ${engineName}`);
    }

    const from = await engine.render(template.from, params);
    const subject = await engine.render(template.subject, params);
    const body = await engine.render(template.body, params);

    await this.mailSender.send(
      new Mail().from(from).subject(subject).html(body).to(to),
    );
  }
}
