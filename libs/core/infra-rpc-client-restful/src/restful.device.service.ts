import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import {
  IDeviceService,
  DeviceModel,
  CreateDeviceModel,
  UpdateDeviceModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class RestfulDeviceService implements IDeviceService {
  private serviceBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async retrieve(ctx: IContext, id: string): Promise<DeviceModel | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/device/${id}`, {
      headers: {
        tenant: ctx.tenant,
      }
    });
  }

  async create(ctx: IContext, device: CreateDeviceModel): Promise<DeviceModel> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/device`, device, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/device/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async update(ctx: IContext, id: string, body: UpdateDeviceModel): Promise<DeviceModel> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/device/${id}`,
      body,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<DeviceModel>> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/devices`,
      {
        params: query,
        headers: {
          tenant: ctx.tenant,
        },
      }
    );
  }
}
