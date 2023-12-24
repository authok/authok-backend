import { IRequestContext } from '@libs/nest-core';
import { DeviceDto, UpdateDeviceDto } from './device.dto';

export interface IDeviceRepository {
  retrieve(ctx: IRequestContext, id: string): Promise<DeviceDto | undefined>;

  delete(ctx: IRequestContext, id: string): Promise<{ affected?: number }>;

  update(
    ctx: IRequestContext,
    id: string,
    body: UpdateDeviceDto,
  ): Promise<{ affected?: number }>;
}
