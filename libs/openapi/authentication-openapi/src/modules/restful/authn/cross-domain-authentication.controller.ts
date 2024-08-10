import {
  UseGuards,
  Post,
  Logger,
  Controller,
  Req,
  Inject,
  Get,
  Body,
  Res,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiOperation } from '@nestjs/swagger';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { IAuthenticationManager, ICredentials } from 'libs/api/authentication-api/src';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { Request, Response } from 'express';
import { ITicketRegistry, ITicketFactory } from 'libs/api/ticket-api/src';
import { OIDCSessionInterceptor } from '@libs/oidc/common/lib/interceptors/oidc-session.interceptor';
import { UserDto } from 'libs/dto/src/user/user.dto';

@JoiSchemaOptions({})
export class CoCredentials {
  @JoiSchema(Joi.string().required())
  client_id: string;

  @JoiSchema(Joi.string().required())
  credential_type: string;

  @JoiSchema(Joi.string().required())
  username: string;

  @JoiSchema(Joi.string().required())
  realm: string;
}

@Controller('co')
export class CrossDomainAuthenticationController {
  constructor(
    @Inject('IAuthenticationManager')
    private readonly authenticationManager: IAuthenticationManager,
    @Inject('ITicketFactory')
    private readonly ticketFactory: ITicketFactory,
    @Inject('ITicketRegistry')
    private readonly ticketRegistry: ITicketRegistry,
  ) {}

  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    }
  })
  @ApiOperation({ summary: '跨域登录' })
  @Post('authenticate')
  // @UseInterceptors(OIDCSessionInterceptor)
  async authenticate(
    @ReqCtx() _ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Body() _credentials: CoCredentials,
  ) {
    console.log('co/authenticate', req.body);

    const provider = await _ctx.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');

    const { username, ...rest } = _credentials;

    const credentials: ICredentials = {
      ...rest,
      connection: _credentials.realm,
    };

    if (credentials.realm === 'sms') {
      credentials.phone_number = username;
    } else if (credentials.realm === 'email') {
      credentials.email = username;
    } else {
      credentials.username = username;
    }

    const principal = await this.authenticationManager.authenticate(
      _ctx,
      credentials,
    );

    const user = principal as UserDto;

    const loginTicket = await this.ticketFactory.create('login', user.user_id);
    await this.ticketRegistry.add(loginTicket);

    console.log('生成 login_ticket', loginTicket);
    
    res.json({
      login_ticket: loginTicket.id,
    });
  }

  @Get('authenticate')
  @UseInterceptors(OIDCSessionInterceptor)
  async authenticateGet() {
    console.log('authenticateGet1');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('authenticateGet2');

    return {
      data: 'haha',
    };
  }
}
