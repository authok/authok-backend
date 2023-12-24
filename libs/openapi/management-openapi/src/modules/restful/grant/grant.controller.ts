import { Controller, Get, Query, Delete, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOkResponse, ApiSecurity, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { PageDto, pageDtoFactory } from 'libs/common/src/pagination/pagination.dto';
import { GrantDto, GrantPageQueryDto } from 'libs/api/infra-api/src/grant/grant.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { IGrantService } from 'libs/api/infra-api/src/grant/grant.service';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@Controller('/api/v1/grants')
@Throttle(3, 1)
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiTags('授权')
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class GrantController {
  constructor(
    @Inject('IGrantService') private readonly grantService: IGrantService,
  ) {}

  @Get()
  @Scopes('read:grants')
  @ApiOperation({ summary: '获取grant' })
  @ApiOkResponse({ type: pageDtoFactory(GrantDto) })
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: GrantPageQueryDto,
  ): Promise<PageDto<GrantDto>> {
    return await this.grantService.paginate(ctx, query || {});
  }

  @Delete(':id?')
  @Scopes('delete:grants')
  @ApiOperation({ summary: '删除授权', description: '删除授权' })
  @ApiParam({ name: 'id', required: false, description: '授权ID' })
  @ApiQuery({ name: 'user_id', required: false, description: '指定用户ID会删除用户所有授权' })
  async delete(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Query('user_id') user_id: string,
  ): Promise<void> {
    if (id) {
      await this.grantService.delete(ctx, id);
    } else if (user_id){
      await this.grantService.deleteByUserId(ctx, user_id)
    }
  }
}
