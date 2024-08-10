import { IContext } from '@libs/nest-core';
import { DeviceModel, UpdateDeviceModel } from './device.model';

export interface IDeviceRepository {
  retrieve(ctx: IContext, id: string): Promise<DeviceModel | undefined>;

  delete(ctx: IContext, id: string): Promise<{ affected?: number }>;

  update(
    ctx: IContext,
    id: string,
    body: UpdateDeviceModel,
  ): Promise<{ affected?: number }>;
}
