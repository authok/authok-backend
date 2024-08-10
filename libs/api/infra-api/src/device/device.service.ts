import { IContext } from '@libs/nest-core';
import { DeviceModel, UpdateDeviceModel } from './device.model';

export interface IDeviceService {
  retrieve(ctx: IContext, id: string): Promise<DeviceModel | undefined>;

  delete(ctx: IContext, id: string): Promise<void>;

  update(
    ctx: IContext,
    id: string,
    body: UpdateDeviceModel,
  ): Promise<DeviceModel>;
}
