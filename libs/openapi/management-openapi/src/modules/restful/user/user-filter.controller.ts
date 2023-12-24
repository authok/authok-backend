import {
  Controller,
  Patch,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Req,
  Inject,
  Query,
  UseGuards,
  CacheTTL,
  CacheInterceptor,
  UseInterceptors,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UserDto,
  RecoveryCodeRegenerationDto,
  CreateUserDto,
  UpdateUserDto,
  UserPageQueryDto,
  PostPermissionsDto,
} from 'libs/api/infra-api/src/user/user.dto';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { IUserService } from 'libs/api/infra-api/src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  PageDto,
  PageQueryDto,
  pageDtoFactory,
} from 'libs/common/src/pagination/pagination.dto';
import { PermissionDto } from 'libs/api/infra-api/src/permission/permission.dto';
import { PostUserRoleDto, RoleDto } from 'libs/api/infra-api/src/role/role.dto';
import { IRoleService } from 'libs/api/infra-api/src/role/role.service';
import {
  CreateIdentityDto,
  IdentityDto,
  LinkIdentityReq,
} from 'libs/api/infra-api/src/identity/identity.dto';
import * as jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { IConnectionService } from 'libs/api/infra-api/src/connection/connection.service';
import { APIException } from 'libs/common/src/exception/api.exception';
import { OrganizationDto } from 'libs/api/infra-api/src/organization/organization.dto';
import { IIdentityService } from 'libs/api/infra-api/src/identity/identity.service';

@ApiTags('用户')
@Controller('/api/v1')
@Throttle(3, 1)
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
      page_size: 100,
    });
    return page.items;
  }
}
