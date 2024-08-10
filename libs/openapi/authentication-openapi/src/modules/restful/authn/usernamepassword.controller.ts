import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  Inject,
  Options,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { PasswordCredentials } from 'libs/core/authentication-core/src/credentials';
import { IAuthenticationManager } from 'libs/api/authentication-api/src';
import { Request, Response } from 'express';
import { ILogService } from 'libs/api/logstream-api/src/log.service';
import * as consolidate from 'consolidate';
import { UserDto } from 'libs/dto/src';
import { 
  IClientService,
} from 'libs/api/infra-api/src';

const default_form_template = `
  <form method="post" name="hiddenform" action="<%= action %>">
    <input type="hidden" name="wa" value="wsignin1.0">
    <input type="hidden" name="wresult" value="<%= JSON.stringify(wresult) %>">
    <input type="hidden" name="wctx" value="<%= JSON.stringify(wctx) %>">
    <noscript>
        <p>
            Script is disabled. Click Submit to continue.
        </p><input type="submit" value="Submit">
    </noscript>
</form>`;

@JoiSchemaOptions({})
export class LoginReq {
  @JoiSchema(Joi.string().required())
  client_id: string;

  @JoiSchema(Joi.string().required())
  connection: string;

  @JoiSchema(Joi.string().required())
  password: string;

  // 遗留
  @JoiSchema(Joi.string().required())
  username: string;

  // 新的，标识符登录模型
  @JoiSchema(Joi.string())
  identifier: string;

  @JoiSchema(Joi.string())
  identifier_type: string;

  @JoiSchema(Joi.string().example('code').required())
  response_type: string;

  @JoiSchema(Joi.object())
  popup_options: Record<string, any>;

  @JoiSchema(Joi.string().example('login'))
  prompt: string;

  @JoiSchema(Joi.string().example('oauth2'))
  protocol: string;

  @JoiSchema(Joi.string())
  redirect_uri: string;

  @JoiSchema(Joi.string().example('openid profile'))
  scope: string;

  @JoiSchema(Joi.boolean().default(true))
  sso: boolean;

  @JoiSchema(Joi.string())
  state: string;

  @JoiSchema(Joi.string())
  tenant: string;

  @JoiSchema(Joi.string().example('code'))
  type: string;
}

@ApiTags('用户名密码登录')
@Controller('/usernamepassword')
export class UsernamePasswordController {
  constructor(
    @Inject('IAuthenticationManager')
    private readonly authenticationManager: IAuthenticationManager,
    @Inject('ILogService')
    private readonly logService: ILogService,
    @Inject('IClientService')
    private clientService: IClientService,
  ) {}

  @Get('challenge')
  @ApiOperation({ summary: '获取验证码' })
  challengeGet(@Query('state') state: string) {
    console.log('state', state);
    return 'xxxx';
  }

  @Post('challenge')
  @ApiOperation({ summary: '判断是否需要获取验证码' })
  challengePost(@Body('state') state: string) {
    console.log('state', state);
    return {
      required: false,
    };
  }

  @Post('login')
  @ApiOperation({ summary: '账户名密码登录' })
  public async loginPost(
    @ReqCtx() ctx: IRequestContext,
    @Body() body: LoginReq,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const provider = await ctx.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');

    try {
      const credentials: PasswordCredentials = {
        credential_type: 'http://authok.io/oauth/grant-type/password-realm',
        client_id: body.client_id,
        connection: body.connection,
        username: body.username,
        password: body.password,
      };

      const client = await this.clientService.retrieve(ctx, body.client_id);
      if (!client) {
        throw new NotFoundException(`client ${body.client_id} not found`);
      }

      const principal = await this.authenticationManager.authenticate(
        ctx,
        credentials,
      );

      const user = principal as UserDto;

      const action = `https://${req.hostname}/login/callback`;

      const wresult = {
        accountId: user.user_id,
      };

      const wctx = {
        strategy: 'authok',
        authokClient: req.header('authok-client'),
        tenant: ctx.tenant,
        connection: body.connection,
        client_id: body.client_id,
        response_type: body.response_type,
        scope: body.scope,
        protocol: body.protocol,
        redirect_uri: body.redirect_uri,
        state: body.state,
        prompt: body.prompt,
        // sid: 'rJygEDIaqiUX_xn6Aq7itTJxvxY27y_P',
        realm: body.connection,
      };

      const html = await consolidate.ejs.render(client.form_template || default_form_template, {
        action,
        wresult,
        wctx,
      });
      console.log('html', html);
      res.send(html);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
