import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { IRequestContext, ReqCtx } from '@libs/nest-core';

// 这个要移到 oidc 模块中

@ApiTags('OIDC 公开接口')
@Controller('/.well-known')
export class WellKnownController {
  @Get('webfinder')
  @ApiOperation({ description: '查找身份提供者' })
  @ApiOkResponse()
  webfinder(
    @Query('resource') resource: string,
    @Query('rel') rel: string,
  ): Promise<any | null> {
    return null;
  }

  @Get('jwks.json')
  async jwks(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const provider = await ctx.currentProvider();
    if (!provider) throw new NotFoundException('tenant not found');

    const callback = provider.callback();
    return await callback(req, res);
  }

  @Get('openid-configuration')
  async openidConfiguration(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    req.url = '/.well-known/openid-configuration';

    const provider = await ctx.currentProvider();
    if (!provider) throw new NotFoundException('tenant not found');

    const callback = provider.callback();
    return await callback(req, res);
  }
}
