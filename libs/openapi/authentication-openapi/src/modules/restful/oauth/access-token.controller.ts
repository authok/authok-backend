import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Res,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { OAuthService } from './oauth.service';

import { 
  IUserService,
  IConnectionService,
} from 'libs/api/infra-api/src';
import { IAuthorizationManager } from 'libs/api/authorization-api/src/authorization.manager';
import { SocialSignInReq } from './access-token.dto';
import { IRequestContext, ReqCtx } from '@libs/nest-core';

@ApiTags('OAuth')
@Controller('oauth/access_token')
export class AccessTokenController {
  constructor(
    private readonly oauthService: OAuthService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IAuthorizationManager')
    private readonly authorizationManager: IAuthorizationManager,
  ) {}

  @Post()
  @ApiOperation({ summary: '社交账户登录' })
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() data: SocialSignInReq,
  ): Promise<any | undefined> {
    const connection = await this.connectionService.findByName(
      ctx,
      data.connection,
    );

    if (!connection) {
      throw new NotFoundException(`Connection: ${connection} not found`);
    }

    const result = await this.authorizationManager.oauthSignIn(
      ctx,
      connection.strategy,
      data,
    );

    // TODO
    return result;
  }
}
