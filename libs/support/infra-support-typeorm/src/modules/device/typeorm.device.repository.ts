import { DeviceEntity } from './device.entity';
import {
  IDeviceRepository,
  DeviceModel,
  UpdateDeviceModel,
} from 'libs/api/infra-api/src';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { IContext } from '@libs/nest-core';

export class TypeOrmDeviceRepository
  extends TenantAwareRepository
  implements IDeviceRepository {
  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<DeviceModel | undefined> {
    const repo = await this.repo(ctx, DeviceEntity);
    return await repo.findOne({
      where: { id }
    });
  }

  async delete(
    ctx: IContext,
    id: string,
  ): Promise<{ affected?: number }> {
    const repo = await this.repo(ctx, DeviceEntity);
    return await repo.delete(id);
  }

  async update(
    ctx: IContext,
    id: string,
    body: UpdateDeviceModel,
  ): Promise<{ affected?: number }> {
    const repo = await this.repo(ctx, DeviceEntity);
    return await repo.update(id, body);
  }
}
