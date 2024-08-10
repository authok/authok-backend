import {
  Controller,
  Patch,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Delete,
  Inject,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
} from '@nestjs/swagger';
import { IRequestContext, ReqCtx, Query as PageQuery, Filter } from '@libs/nest-core';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PageDto, pageDtoFactory } from 'libs/common/src/pagination/pagination.dto';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { ICustomDomainService } from 'libs/api/infra-api/src';
import { 
  CustomDomainDto, 
  CreateCustomDomainDto, 
  UpdateCustomDomainDto, 
  CustomDomainPageQueryDto,
} from 'libs/dto/src';

@Controller('/api/v2/custom-domains')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiTags('自定义域名')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class CustomDomainController {
  constructor(
    @Inject('ICustomDomainService')
    private readonly customDomainService: ICustomDomainService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: '根据ID查找自定义域名', description: '根据ID查找自定义域名' })
  @ApiOkResponse({
    type: CustomDomainDto,
  })
  @ApiParam({ name: 'id', description: '身份源ID' })
  @Scopes('read:custom_domains')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<CustomDomainDto | undefined> {
    const connection = await this.customDomainService.findById(ctx, id);
    if (!connection) throw new NotFoundException('connection not found');

    return connection;
  }

  @Post()
  @ApiOperation({ summary: '创建自定义域名', description: '创建自定义域名' })
  @ApiOkResponse({
    description: '自定义域名',
    type: CustomDomainDto,
  })
  @Scopes('create:custom_domains')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() input: CreateCustomDomainDto,
  ): Promise<CustomDomainDto> {
    // 这里要用登录用户的租户
    return await this.customDomainService.createOne(ctx, input);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新自定义域名' })
  @ApiOkResponse({
    description: '自定义域名',
    type: CustomDomainDto,
  })
  @Scopes('update:custom_domains')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: UpdateCustomDomainDto,
  ): Promise<CustomDomainDto> {
    return await this.customDomainService.updateOne(
      ctx,
      id,
      data,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除自定义域名' })
  @Scopes('delete:custom_domains')
  async delete(@Param('id') id: string, @ReqCtx() ctx: IRequestContext): Promise<void> {
    await this.customDomainService.deleteOne(
      ctx,
      id,
    );
  }

  @Get()
  @ApiOperation({ summary: '获取自定义域名列表', description: '获取自定义域名列表' })
  @ApiOkResponse({ type: pageDtoFactory(CustomDomainDto) })
  @Scopes('read:custom_domains')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() _query: CustomDomainPageQueryDto,
  ): Promise<PageDto<CustomDomainDto>> {
    const filter = {} as Filter<CustomDomainDto>;

    const query = {
      paging: {
        offset: (_query.page - 1) * _query.per_page,
        limit: _query.per_page,
      },
      filter,
    } as PageQuery<CustomDomainDto>;

    const items = await this.customDomainService.query(ctx, query);
    const total = await this.customDomainService.count(ctx, query.filter);

    return {
      meta: {
        page: _query.page,
        per_page: _query.per_page,
        total,
      },
      items,
    };
  }
}
