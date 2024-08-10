import {
  Controller,
  Query,
  Get,
  Inject,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { IUserService, IPasswordResetService } from 'libs/api/infra-api/src';
import { Response } from 'express';

@Controller('lo')
export class LoController {
  constructor(
    @Inject('IPasswordResetService')
    private readonly passwordResetService: IPasswordResetService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Get('reset')
  @ApiOperation({ summary: '密码重置' })
  async reset(
    @ReqCtx() ctx: IRequestContext,
    @Query('ticket') ticket,
    @Res() res: Response,
  ) {
    const passwordReset = await this.passwordResetService.findByToken(
      ctx,
      ticket,
    );

    if (!passwordReset) {
      throw new NotFoundException('请求不合法');
    }

    if (new Date(passwordReset.expires_at) >= new Date()) {
      throw new NotFoundException('请求已过期');
    }

    const user = await this.userService.retrieve(ctx, passwordReset.user_id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    res.render('password-reset', {
      user,
    });
  }

  @Get('forget-pwd')
  public async userForgotPasswordGet(
    @ReqCtx() ctx: IRequestContext,
    @Res() res: Response,
  ) {
    const locals = {
      title: '忘记密码',
      client: {},
      debug: false,
      details: {},
      params: {},
      interaction: true,
      error: false,
    };

    return res.render('forgot-password', locals, (err, html) => {
      if (err) throw err;
      res.render('_password-reset-layout', {
        ...locals,
        body: html,
      });
    });
  }
}
