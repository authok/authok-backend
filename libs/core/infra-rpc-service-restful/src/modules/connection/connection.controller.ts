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
import { IConnectionService } from 'libs/api/infra-api/src';
import {
  ConnectionDto,
  CreateConnectionDto,
  UpdateConnectionDto,
  ConnectionPageQueryDto,
} from 'libs/dto/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';

@ApiTags('身份源')
@Controller('connections')
export class ConnectionController {
  constructor(
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
  ) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '身份源id',
  })
  @ApiNotFoundResponse({ description: 'Connection not found' })
  @ApiOkResponse({ description: '获取连接', type: ConnectionDto })
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ConnectionDto | null> {
    return this.connectionService.retrieve(ctx, id);
  }

  @Get('findByName/:name/:tenant')
  @ApiParam({
    name: 'name',
    description: '身份源的唯一标识',
  })
  @ApiNotFoundResponse({ description: 'Connection not found' })
  @ApiOkResponse({ description: '获取身份源', type: ConnectionDto })
  @ApiOperation({ summary: '根据名字查找身份源' })
  async findByName(
    @ReqCtx() ctx: IRequestContext,
    @Param('name') name: string,
  ): Promise<ConnectionDto | null> {
    return this.connectionService.findByName(ctx, name);
  }

  @Post()
  @ApiOkResponse({
    description: '创建身份源',
    type: ConnectionDto,
  })
  @ApiOperation({ summary: '创建身份源' })
  create(
    @ReqCtx() ctx: IRequestContext,
    @Body() connection: CreateConnectionDto,
  ): Promise<ConnectionDto> {
    return this.connectionService.create(ctx, connection);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '身份源',
    type: ConnectionDto,
  })
  @ApiOperation({ summary: '更新身份源' })
  update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: UpdateConnectionDto,
  ) {
    return this.connectionService.update(ctx, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除身份源' })
  delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return this.connectionService.delete(ctx, id);
  }

  @Get()
  @ApiOperation({ summary: '分页查询' })
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ConnectionPageQueryDto,
  ): Promise<PageDto<ConnectionDto>> {
    return await this.connectionService.paginate(ctx, query);
  }
}
