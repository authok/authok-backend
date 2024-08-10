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
import {
  ClientDto,
  CreateClientDto,
  UpdateClientDto,
} from 'libs/dto/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { IClientService } from 'libs/api/infra-api/src';

@ApiTags('应用')
@Controller('clients')
export class ClientController {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '应用id',
  })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiOkResponse({ description: '获取应用', type: ClientDto })
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ClientDto | null> {
    return this.clientService.retrieve(ctx, id);
  }

  @Post()
  @ApiOkResponse({
    description: '应用',
    type: ClientDto,
  })
  @ApiOperation({ summary: '创建应用' })
  create(
    @ReqCtx() ctx: IRequestContext,
    @Body() client: CreateClientDto,
  ): Promise<ClientDto> {
    return this.clientService.create(ctx, client);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '应用',
    type: ClientDto,
  })
  update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: UpdateClientDto,
  ) {
    return this.clientService.update(ctx, id, body);
  }

  @Delete(':id')
  delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return this.clientService.delete(ctx, id);
  }

  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<ClientDto>> {
    return await this.clientService.paginate(ctx, query);
  }
}
