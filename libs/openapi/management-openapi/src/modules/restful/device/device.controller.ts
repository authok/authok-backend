import { Controller, Get, Param, Delete, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { IDeviceService } from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { DeviceDto } from 'libs/dto/src';

@ApiTags('设备')
@Controller('/device')
export class DeviceController {
  constructor(
    @Inject('IDeviceService')
    private readonly deviceService: IDeviceService,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: '查找设备', description: '根据ID查找设备' })
  @ApiOkResponse({
    type: DeviceDto,
  })
  retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<DeviceDto | null> {
    return this.deviceService.retrieve(ctx, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除设备' })
  delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    this.deviceService.delete(ctx, id);
  }
}
