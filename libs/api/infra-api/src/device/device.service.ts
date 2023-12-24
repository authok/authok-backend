import { IRequestContext } from '@libs/nest-core';
import { DeviceDto, UpdateDeviceDto } from './device.dto';

export interface IDeviceService {
  retrieve(ctx: IRequestContext, id: string): Promise<DeviceDto | undefined>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  update(
    ctx: IRequestContext,
    id: string,
    body: UpdateDeviceDto,
  ): Promise<DeviceDto>;
}
