import {
  Controller,
  Post,
  Body,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
  Inject,
  UseGuards,
  Res,
  Req,
  Get,
  Query,
  UseInterceptors,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  PasswordlessStartReq,
  PasswordlessVerifyReq,
} from './passwordless.dto';
import { IPasswordlessTokenRepository } from 'libs/support/passwordless/src/passwordless-token.repository';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { ISmsSender } from 'libs/core/notifications-core/src/sms/sms-sender.interface';
import { TemplateSms } from 'libs/core/notifications-core/src/sms/sms';
import dayjs from 'dayjs';
import { RequestContext } from 'libs/core/infra-core/src/request-context/request-context.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PhoneParser } from 'libs/shared/src/services/phone.parser';
import { Request, Response } from 'express';
import { IAuthenticationManager } from 'libs/api/authentication-api/src';
import { PasswordlessCredentials } from 'libs/support/passwordless/src/credentials';
import { saveOidcSession } from '@libs/oidc/common/lib/utils/session/session';
import { OIDCSessionInterceptor } from '@libs/oidc/common/lib/interceptors/oidc-session.interceptor';
import { UserDto } from 'libs/dto/src/user/user.dto';
import {
  IMailer,
  IUserService,
  IConnectionService, 
  IClientService, 
  IEmailTemplateService,
} from 'libs/api/infra-api/src';
import { EmailTemplateDto } from 'libs/dto/src';

@ApiTags('免密登录')
@Controller('/passwordless')
export class PasswordlessController {
  constructor(
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IClientService')
    private readonly clientService: IClientService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IAuthenticationManager')
    private readonly authenticationManager: IAuthenticationManager,
    @Inject('IMailer')
    private readonly mailer: IMailer,
    @Inject('ISmsSender')
    private readonly smsSender: ISmsSender,
    @Inject('IPasswordlessTokenRepository')
    private readonly passwordlessTokenRepository: IPasswordlessTokenRepository,
    private readonly phoneParser: PhoneParser,

    @Inject('IEmailTemplateService')
    private readonly emailTemplateService: IEmailTemplateService,
  ) {}

  @Post('start')
  @ApiOperation({ summary: '开始免密登录' })
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      limit: 3,
      ttl: 1000,
    }
  })
  async start(
    @ReqCtx() ctx: RequestContext,
    @Res() res: Response,
    @Body() req: PasswordlessStartReq,
  ) {
    console.log('passwordless: ', req);
    const scene = req.scene || 'login';

    const client = await this.clientService.retrieve(ctx, req.client_id);

    if (!client) {
      throw new NotFoundException('找不到对应应用 ' + req.client_id);
    }
    Logger.debug('找到应用: ' + client.client_id);

    if (req.email) {
      let token = await this.passwordlessTokenRepository.findToken(
        ctx,
        scene,
        req.email,
      );

      if (token) {
        Logger.warn(
          `already has token for ${req.email}, token: ${token.value}`,
        );
        if (dayjs().subtract(1, 'minute').toDate() < token.created_at) {
          Logger.warn(`一分钟内不能重复发送`);

          throw new BadRequestException('token already exists');
        }
      }

      const connection = await this.connectionService.findByName(ctx, 'email');

      if (!connection) {
        throw new InternalServerErrorException('找对到对应身份源');
      }

      token = this.passwordlessTokenRepository.createToken(scene, req.email);

      const emailTemplate = connection.options?.email as EmailTemplateDto;
      if (!emailTemplate) {
        throw new InternalServerErrorException('邮件身份源没有配置');
      }

      await this.mailer.send(
        ctx,
        emailTemplate,
        {
          user: { email: req.email },
          application: { name: client.name },
          code: token.value,
          send: req.send,
        },
        req.email,
      );

      token.expired_at = dayjs().add(5, 'minute').toDate();
      await this.passwordlessTokenRepository.deleteToken(ctx, scene, req.email);
      await this.passwordlessTokenRepository.saveToken(ctx, token);

      Logger.debug('邮件发送成功');
      res.sendStatus(HttpStatus.OK);
      return;
    } else if (req.phone_number) {
      let token = await this.passwordlessTokenRepository.findToken(
        ctx,
        scene,
        req.phone_number,
      );
      if (token) {
        Logger.warn(
          `already has token for ${req.phone_number}, token: ${token.value}'`,
        );
        if (dayjs().subtract(1, 'minute').toDate() < token.created_at) {
          Logger.warn('一分钟内不能重复发送短信验证码');
          throw new HttpException(
            'token already exists',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
      }

      const connection = await this.connectionService.findByName(ctx, 'sms');
      if (!connection) {
        Logger.error('connection not found');
        throw new NotFoundException('connection not found');
      }

      token = this.passwordlessTokenRepository.createToken(
        scene,
        req.phone_number,
      );

      const { phone_number, phone_country_code } = this.phoneParser.parse(
        req.phone_number,
      );

      const sms: TemplateSms = {
        from: connection.options?.from,
        templateId: '498815',
        countryCode: `+${phone_country_code}`,
        to: phone_number,
        params: {
          0: token.value,
          1: '5',
        },
        sign: '魔范宝贝',
      };
      await this.smsSender.send({}, sms);
      // 发送成功了再保存

      token.expired_at = dayjs().add(5, 'minute').toDate();
      await this.passwordlessTokenRepository.deleteToken(
        ctx,
        scene,
        req.phone_number,
      );
      await this.passwordlessTokenRepository.saveToken(ctx, token);
      res.sendStatus(HttpStatus.OK);
    } else {
      throw new HttpException(
        'invalid input, missing email or phone_number',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Post('verify')
  @UseInterceptors(OIDCSessionInterceptor)
  async verify(
    @ReqCtx() _ctx: IRequestContext,
    @Req() req: Request,
    @Body() query: PasswordlessVerifyReq,
  ) {
    const provider = await _ctx.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');

    const credentials = {
      credential_type: 'http://authok.io/oauth/grant-type/passwordless/otp',
      client_id: query.client_id,
      connection: query.connection,
      phone_number: query.phone_number,
      email: query.email,
      otp: query.verification_code,
      ip: req.ip,
    } as PasswordlessCredentials;

    const principal = await this.authenticationManager.authenticate(
      _ctx,
      credentials,
    );

    const user = principal as UserDto;

    const ctx = (req as any).ctx;

    // 要把上一个 session + client 对应的 grant 清除掉，否则会报错
    const session = ctx.oidc.session;

    // 把现有 session 清空
    session.authorizations = {};
    session.state = undefined;
    session.resetIdentifier();

    // 登入新的账户
    session.loginAccount({
      accountId: user.user_id,
      loginTs: Math.floor(Date.now() / 1000),
      amr: ['pwd'],
      acr: 'urn:mace:incommon:iap:bronze',
      transient: false,
    });
    saveOidcSession(ctx);
  }

  @Get('verify_redirect')
  verifyRedirect(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    let url = `/authorize?client_id=${query.client_id}&response_type=${
      query.response_type
    }&redirect_uri=${encodeURIComponent(query.redirect_uri)}&scope=${
      query.scope
    }&verification_code=${query.verification_code}&connection=${
      query.connection
    }&popup=${query.popup}&state=${query.state}`;

    if (query.connection === 'sms') {
      url += '&phone_number=' + query.phone_number;
    } else if (query.connection === 'email') {
      url += '&email=' + query.email;
    }

    console.log('verifyRedirect', query, url);

    res.redirect(url);
  }
}
