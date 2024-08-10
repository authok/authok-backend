import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  Query,
  Inject,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ITenantService } from 'libs/api/infra-api/src';
import {
  TenantDto,
  CreateTenantDto,
  UpdateTenantDto,
} from 'libs/dto/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination';

@ApiTags('租户')
@Controller('tenants')
export class TenantController {
  constructor(
    @Inject('ITenantService') private readonly tenantService: ITenantService,
  ) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '租户',
  })
  @ApiNotFoundResponse({ description: '租户未找到' })
  @ApiOkResponse({ description: '获取API', type: TenantDto })
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<TenantDto | null> {
    return this.tenantService.retrieve(ctx, id);
  }

  @Get('findByName/:name')
  @ApiParam({
    name: 'name',
    description: '租户名字',
  })
  @ApiNotFoundResponse({ description: '租户未找到' })
  @ApiOkResponse({ description: '根据名字查找租户', type: TenantDto })
  async findByName(
    @ReqCtx() ctx: IRequestContext,
    @Param('name') name: string,
  ): Promise<TenantDto | null> {
    return this.tenantService.findByName(ctx, name);
  }

  @Post()
  @ApiOkResponse({
    description: '创建租户',
    type: TenantDto,
  })
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() tenant: CreateTenantDto,
  ): Promise<TenantDto> {
    return await this.tenantService.create(ctx, tenant);
  }

  @Delete(':id')
  remove(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return this.tenantService.delete(ctx, id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '租户',
    type: TenantDto,
  })
  update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: UpdateTenantDto,
  ) {
    return this.tenantService.update(ctx, id, data);
  }

  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<TenantDto>> {
    return await this.tenantService.paginate(ctx, query);
  }
}
