import {
  Controller,
  Post,
  Body,
  Req,
  NotFoundException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { 
  IConnectionService,
  IUserService,
  ITriggerService, 
  TriggerContextBuilder,
} from 'libs/api/infra-api/src';
import { 
  CreateUserDto,
  IdentityDto,
} from 'libs/dto/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import {
  SignupReq,
  ChangePasswordReq,
  ChangePasswordDirectlyReq,
} from './signup.dto';
import { nanoid } from 'nanoid';
import { APIException } from 'libs/common/src/exception/api.exception';
import { IPasswordlessTokenRepository } from 'libs/support/passwordless/src/passwordless-token.repository';

const RESET_PASSWORD_SCENE = `reset_pwd`;

@ApiTags('OAuth2')
@Controller('/dbconnections')
export class DBConnectionController {
  constructor(
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IPasswordlessTokenRepository')
    private readonly passwordlessTokenRepository: IPasswordlessTokenRepository,
    @Inject('ITriggerService') private readonly triggerService: ITriggerService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '注册新用户' })
  async signup(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Body() body: SignupReq,
  ) {
    const existingConnection = await this.connectionService.findByName(
      ctx,
      body.connection,
    );

    if (!existingConnection) {
      throw new NotFoundException('connection not found');
    }

    if (existingConnection.strategy != 'authok') {
      Logger.error(
        `connection ${existingConnection.name} is not a dbconnection`,
      );

      throw new Error('connection is not a dbconnection');
    }

    const user_id = nanoid(24);

    const user: CreateUserDto = {
      user_id: existingConnection.strategy + '|' + user_id,
      connection: body.connection,
      email: body.email,
      phone_number: body.phone_number,
      username: body.username,
      password: body.password,
      signup_ip: req.ip,
      last_ip: req.ip,
      identities: [
        {
          user_id,
          connection: body.connection,
          provider: existingConnection.strategy,
          is_social: false,
        } as IdentityDto,
      ],
    };

    const userAdded = await this.userService.create(ctx, user);

    Logger.debug(
      `用户创建成功 guid: ${userAdded.id}, user_id: ${userAdded.user_id}`,
    );

    const event = {
      request: {
        hostname: req.hostname,
        ip: req.ip,
        body: req.body,
        query: req.query,
        headers: req.headers,
      },
      user,
    };

    // 这里异步执行即可
    this.triggerService.trigger(
      ctx,
      new TriggerContextBuilder().trigger('post-register').event(event).build(),
    );

    return {
      id: userAdded.id,
      user_id: userAdded.user_id,
      email: userAdded.email,
      email_verified: userAdded.email_verified,
      phone_number: userAdded.phone_number,
      username: userAdded.username,
      given_name: userAdded.given_name,
      family_name: userAdded.family_name,
      name: userAdded.name,
      nickname: userAdded.nickname,
      picture: userAdded.picture,
      signup_at: userAdded.signup_at,
      signup_ip: userAdded.signup_ip,
      identities: userAdded.identities,
    };
  }

  @Post('change_password')
  @ApiOperation({ summary: '更改密码' })
  async changePassword(
    @ReqCtx() ctx: IRequestContext,
    @Body() req: ChangePasswordReq,
    @Req() r: Request,
  ) {
    await this.userService.startResetPasswordByEmail(
      ctx,
      req.connection,
      req.email,
      r.ip,
    );
  }

  @Post('change_password_directly')
  @ApiOperation({ summary: '直接更改密码' })
  async changePasswordDirectly(
    @ReqCtx() ctx: IRequestContext,
    @Body() req: ChangePasswordDirectlyReq,
    @Req() r: Request,
  ) {
    console.log('changePassword: ', r.headers, req);
    switch (req.realm) {
      case 'email': {
        const user = await this.userService.findByEmail(
          ctx,
          req.connection,
          req.username,
        );
        if (!user) {
          throw new NotFoundException('user not found');
        }

        const token = await this.passwordlessTokenRepository.findToken(
          ctx,
          RESET_PASSWORD_SCENE,
          user.user_id,
        );
        if (!token) {
          throw new APIException('token not found');
        }

        if (token.value !== req.vcode) {
          throw new APIException('token not match');
        }

        await this.userService.update(ctx, user.user_id, {
          password: req.password,
        });
        break;
      }
      case 'sms': {
        const user = await this.userService.findByPhoneNumber(
          ctx,
          req.connection,
          req.username,
        );
        if (!user) {
          throw new NotFoundException('user not found');
        }

        const token = await this.passwordlessTokenRepository.findToken(
          ctx,
          RESET_PASSWORD_SCENE,
          user.user_id,
        );
        if (!token) {
          throw new APIException('token not found');
        }

        if (token.value !== req.vcode) {
          throw new APIException('token not match');
        }

        await this.userService.update(ctx, user.user_id, {
          password: req.password,
        });

        break;
      }
      default:
        throw new APIException(`unknown realm: ${req.realm}`);
    }
  }
}
