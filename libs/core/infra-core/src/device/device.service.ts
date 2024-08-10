import { 
  IDeviceService,
  IDeviceRepository,
} from 'libs/api/infra-api/src';
import {
  DeviceDto,
  UpdateDeviceDto,
} from 'libs/dto/src';
import { Inject, NotFoundException } from '@nestjs/common';
import { IRequestContext } from '@libs/nest-core';

export class DeviceService implements IDeviceService {
  constructor(
    @Inject('IDeviceRepository') private readonly repository: IDeviceRepository,
  ) {}

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<DeviceDto | undefined> {
    return this.repository.retrieve(ctx, id);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    await this.repository.delete(ctx, id);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    body: UpdateDeviceDto,
  ): Promise<DeviceDto> {
    const result = await this.repository.update(ctx, id, body);
    if (result.affected) {
      return await this.repository.retrieve(ctx, id);
    } else {
      throw new NotFoundException(`Device : ${id} not found!`);
    }
  }
}
