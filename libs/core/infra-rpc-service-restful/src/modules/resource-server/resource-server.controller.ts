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
  ApiOperation,
} from '@nestjs/swagger';
import { IResourceServerService } from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { 
  ResourceServerPageQueryDto, 
  ResourceServerDto, 
  CreateResourceServerDto, 
  UpdateResourceServerDto,
} from 'libs/dto/src';

@ApiTags('API')
@Controller('resource-servers')
export class ResourceServerController {
  constructor(
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
  ) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '资源服务器ID',
  })
  @ApiOkResponse({ description: '获取API', type: ResourceServerDto })
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ResourceServerDto | null> {
    return this.resourceServerService.retrieve(ctx, id);
  }

  @Post()
  @ApiOkResponse({
    description: '创建API',
    type: ResourceServerDto,
  })
  create(
    @ReqCtx() ctx: IRequestContext,
    @Body() input: CreateResourceServerDto,
  ): Promise<ResourceServerDto> {
    return this.resourceServerService.create(ctx, input);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'API',
    type: ResourceServerDto,
  })
  update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() updateApiDto: UpdateResourceServerDto,
  ) {
    return this.resourceServerService.update(ctx, id, updateApiDto);
  }

  @Delete(':id')
  delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return this.resourceServerService.delete(ctx, id);
  }

  @Get()
  @ApiOperation({ summary: '翻页' })
  paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ResourceServerPageQueryDto,
  ): Promise<PageDto<ResourceServerDto>> {
    return this.resourceServerService.paginate(ctx, query);
  }
}
