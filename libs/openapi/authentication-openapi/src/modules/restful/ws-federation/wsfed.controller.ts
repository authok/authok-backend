import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('SAML')
@Controller('/wsfed')
export class WsfedController {
  constructor() {}

  @Get('/:client_id')
  @ApiOperation({ summary: '初始化登录' })
  get(
    @Param('client_id') clientId: string,
    @Query('wtrealm') wtrealm: string,
    @Query('whr') whr: string,
    @Query('wctx') wctx: string,
    @Query('wreply') wreply: string,
  ): Promise<unknown | undefined> {
    return null;
  }
}
