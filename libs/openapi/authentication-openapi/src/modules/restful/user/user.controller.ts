import { Controller, Inject, Req, Get, Options } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserService } from 'libs/api/infra-api/src';
import { IPService } from 'libs/support/ipservice-support/src/ip.service';
import { Request } from 'express';

@ApiTags('用户')
@Controller('/user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
    @Inject('IPService') private readonly ipService: IPService,
  ) {}

  @Get('geoloc/country')
  async country(@Req() req: Request) {
    /* TODO 每次调用 第三方 api 太慢
    const data = await this.ipService.fetch(req.ip);
    data.country_code = data.country_code || 'CN';
    return data;
    */

    return {
      country_code: 'CN',
    }
  }

  @Get('ssodata')
  async ssodata() {
    return {};
  }
}
