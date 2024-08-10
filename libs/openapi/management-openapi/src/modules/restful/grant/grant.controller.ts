import { Controller, Get, Query, Delete, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOkResponse, ApiSecurity, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { PageDto, pageDtoFactory } from 'libs/common/src/pagination';
import { GrantDto, GrantPageQueryDto } from 'libs/dto/src';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { IGrantService } from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@Controller('/api/v2/grants')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiTags('Grant')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
export class GrantController {
  constructor(
    @Inject('IGrantService') private readonly grantService: IGrantService,
  ) {}

  @Get()
  @Scopes('read:grants')
  @ApiOperation({ summary: 'List grants' })
  @ApiOkResponse({ type: pageDtoFactory(GrantDto) })
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: GrantPageQueryDto,
  ): Promise<PageDto<GrantDto>> {
    return await this.grantService.paginate(ctx, query || {});
  }

  @Delete(':id?')
  @Scopes('delete:grants')
  @ApiOperation({ summary: 'Delete grant', description: 'Delete grant' })
  @ApiParam({ name: 'id', required: false, description: 'Grant ID' })
  @ApiQuery({ name: 'user_id', required: false, description: 'Specifying a user ID will delete all authorizations of the user.' })
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
