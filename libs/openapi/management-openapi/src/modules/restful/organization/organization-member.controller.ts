import {
  Controller,
  Inject,
  Post,
  Param,
  Query,
  Get,
  Body,
  Delete,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { 
  IOrganizationMemberService,
  IOrganizationService,
} from 'libs/api/infra-api/src';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import {
  AddOrganizationMembersDto,
  RemoveOrganizationMembersDto,
  OrganizationMemberPageQueryDto,
  OrganizationMemberDto,
} from 'libs/dto/src';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { plainToClass } from 'class-transformer';

@Controller('/api/v2/organizations/:org_id/members')
@ApiTags('组织')
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
export class OrganizationMemberController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve a member',
    description: 'Retrieve a member',
  })
  @Get(':user_id')
  @Scopes('read:organization_members')
  async get(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') orgId: string,
    @Param('user_id') userId: string,
  ): Promise<OrganizationMemberDto | undefined> {
    const member = await this.organizationMemberService.findByRelation(ctx, orgId, userId);
    if (!member) throw new NotFoundException();

    const { user, roles, ...rest } = member;

    return plainToClass(OrganizationMemberDto, {
      ...rest,
      roles: roles?.map(it => ({
        id: it.role?.id,
        name: it.role?.name,
      })),
    });
  }

  @ApiOperation({
    summary: 'List organization members.',
    description: 'Get members who belong to an organization',
  })
  @Get('')
  @Scopes('read:organization_members')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Query() _query: OrganizationMemberPageQueryDto,
  ): Promise<PageDto<OrganizationMemberDto>> {
    const query = { ..._query, org_id };

    const { meta, items: _items } = await this.organizationMemberService.paginate(ctx, query);
    const items = _items.map(it => plainToClass(OrganizationMemberDto, it));

    return plainToClass(PageDto<OrganizationMemberDto>, {
      meta,
      items,
    })
  }

  @ApiOperation({
    summary: 'Add members to an organization.',
    description: 'Add members to an organization.',
  })
  @Post('')
  @Scopes('create:organization_members')
  async add(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() body: AddOrganizationMembersDto,
  ): Promise<void> {
    await this.organizationService.addMembers(ctx, org_id, body.members);
  }

  @Delete('')
  @Scopes('delete:organization_members')
  async remove(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() body: RemoveOrganizationMembersDto,
  ): Promise<void> {
    return await this.organizationService.removeMembers(
      ctx,
      org_id,
      body.members,
    );
  }
}
