import { ISmsSender } from 'libs/core/notifications-core/src/sms/sms-sender.interface';
import { ISms, TemplateSms } from 'libs/core/notifications-core/src/sms/sms';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';

@Injectable()
export class CloudNativeSmsSender implements ISmsSender {
  private apihost: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promisifyHttp: PromisifyHttpService,
  ) {
    this.apihost = this.configService.get('services.sms.apihost');
  }

  async send(ctx: Record<string, any>, _sms: ISms): Promise<boolean> {
    const sms = _sms as TemplateSms;
    // TODO
    console.log('发送短信: ', this.apihost, sms);
    const r = await this.promisifyHttp.post(
      this.apihost + '/xapis/noauth/sms/v1/send',
      {
        phone: sms.countryCode + sms.to,
        template: sms.templateId,
        templateParams: sms.params,
        sign: sms.sign,
        channel: 'qcloud',
        channelParams: {},
      },
      {
        params: {
          appId: 'bc54d61324844bbd9ac5ef5a69e20998',
        },
      },
    );

    console.log('r: ', r);

    return false;
  }
}
