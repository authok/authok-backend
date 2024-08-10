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
  ApiNotFoundResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { IOrganizationService } from 'libs/api/infra-api/src';
import {
  OrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from 'libs/dto/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

@ApiTags('组织')
@Controller('organizations')
export class OrganizationController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
  ) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '组织id',
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiOkResponse({ description: '获取组织', type: OrganizationDto })
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<OrganizationDto | null> {
    return this.organizationService.retrieve(ctx, id);
  }

  @Get('findByName/:name')
  @ApiParam({
    name: 'name',
    description: '组织名称',
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiOkResponse({ description: '获取组织', type: OrganizationDto })
  async findByName(
    @ReqCtx() ctx: IRequestContext,
    @Param('name') name: string,
  ): Promise<OrganizationDto | null> {
    return await this.organizationService.findByName(ctx, name);
  }

  @Post()
  @ApiOkResponse({
    description: '组织',
    type: OrganizationDto,
  })
  @ApiOperation({ summary: '创建组织' })
  create(
    @ReqCtx() ctx: IRequestContext,
    @Body() body: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    return this.organizationService.create(ctx, body);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '组织',
    type: OrganizationDto,
  })
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: UpdateOrganizationDto,
  ) {
    return await this.organizationService.update(ctx, id, body);
  }

  @Delete(':id')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return await this.organizationService.delete(ctx, id);
  }

  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>> {
    return await this.organizationService.paginate(ctx, query);
  }
}
