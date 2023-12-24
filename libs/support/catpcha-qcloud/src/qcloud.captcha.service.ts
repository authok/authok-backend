import { Injectable, Logger } from '@nestjs/common';
import { ICaptchaResult } from 'libs/api/captcha-api/src/captcha-result';
import { ICaptchaService } from 'libs/api/captcha-api/src/captcha.service';
import * as qcloud from 'tencentcloud-sdk-nodejs';
const Client = qcloud.captcha.v20190722.Client;

@Injectable()
export class QCloudCaptchaService implements ICaptchaService {
  constructor() {}

  async verify(_req: ICaptchaResult): Promise<boolean> {
    const client = new Client({
      credential: {
        secretId: 'secretId',
        secretKey: 'secretKey',
      },
      region: 'ap-shenzhen',
      profile: {
        signMethod: 'HmacSHA256',
        httpProfile: {
          reqMethod: 'POST',
          reqTimeout: 30,
        },
      },
    });

    const req = _req as any;

    const response = await client.DescribeCaptchaResult({
      CaptchaType: req.CaptchaType,
      Ticket: req.Ticket,
      UserIp: req.UserIp,
      Randstr: req.Randstr,
      CaptchaAppId: 201111111,
      AppSecretKey: 'xxxxx',
      BusinessId: 1,
      SceneId: 2,
      MacAddress: req.MacAddress,
      Imei: req.Imei,
      NeedGetCaptchaTime: req.NeedGetCaptchaTime,
    });

    Logger.log(
      'captcher verify result, code: ' +
        response.CaptchaCode +
        ', msg: ' +
        response.CaptchaMsg,
    );

    if (response.CaptchaCode != 1) {
      throw new Error('captcha not matched');
    }

    return response.CaptchaCode == 1;
  }
}
