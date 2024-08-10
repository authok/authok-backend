import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UserDto,
} from 'libs/dto/src/user/user.dto';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { 
  IUserService,
  IRoleService,
  IIdentityService,
  IConnectionService,
} from 'libs/api/infra-api/src';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('用户')
@Controller('/api/v2')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class UserFilterController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IIdentityService')
    private readonly identityService: IIdentityService,
  ) {}

  @Get('/users-by-email')
  @ApiOperation({
    description: '根据Email查找用户',
    summary: '根据Email查找用户',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Scopes('read:users')
  async listByEmail(
    @ReqCtx() ctx: IRequestContext,
    @Query('email') email: string,
  ): Promise<UserDto[]> {
    // 还没有切换到 nest-query
    const page = await this.userService.paginate(ctx, {
      email,
      per_page: 100,
    });
    
    const items = page.items.map(it => it as unknown as UserDto);
    return items;
  }
}
