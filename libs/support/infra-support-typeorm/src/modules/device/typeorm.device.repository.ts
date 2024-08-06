import { IDeviceRepository } from 'libs/api/infra-api/src/device/device.repository';
import { DeviceEntity } from './device.entity';
import {
  DeviceDto,
  UpdateDeviceDto,
} from 'libs/api/infra-api/src/device/device.dto';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { IRequestContext } from '@libs/nest-core';

export class TypeOrmDeviceRepository
  extends TenantAwareRepository
  implements IDeviceRepository {
  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<DeviceDto | undefined> {
    const repo = await this.repo(ctx, DeviceEntity);
    return await repo.findOne({
      where: { id }
    });
  }

  async delete(
    ctx: IRequestContext,
    id: string,
  ): Promise<{ affected?: number }> {
    const repo = await this.repo(ctx, DeviceEntity);
    return await repo.delete(id);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    body: UpdateDeviceDto,
  ): Promise<{ affected?: number }> {
    const repo = await this.repo(ctx, DeviceEntity);
    return await repo.update(id, body);
  }
}
