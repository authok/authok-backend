import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  ChallengeReq,
  ChallengeRes,
  AssociateReq,
  AuthenticatorDto,
  AssociateRes,
} from './mfa.dto';
import { AuthGuard } from '@nestjs/passport';
import { IConnectionService } from 'libs/api/infra-api/src';

@ApiTags('多因素认证')
@Controller('/mfa')
export class MFAController {
  constructor(
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
  ) {}

  @Post('/challenge')
  @ApiOperation({ summary: '请求一个' })
  challenge(@Body() req: ChallengeReq): Promise<ChallengeRes | undefined> {
    return null;
  }

  @Post('/associate')
  @ApiOperation({ summary: '关联一个认证器' })
  async associate(
    @Body() req: AssociateReq,
  ): Promise<AssociateRes | undefined> {
    // TODO
    return null;
  }

  @Get('/authenticators/:authenticator_id')
  @UseGuards(AuthGuard('jwt')) // access token
  async authenticators(): Promise<AuthenticatorDto[] | undefined> {
    // TODO
    return null;
  }

  @Delete('/authenticators')
  @UseGuards(AuthGuard('jwt')) // access token
  async deleteAuthenticator(
    @Param('authenticator_id') authenticatorId: string,
  ) {
    // TODO
  }
}
