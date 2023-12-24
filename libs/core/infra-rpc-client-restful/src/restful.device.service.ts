import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IDeviceService } from 'libs/api/infra-api/src/device/device.service';
import {
  DeviceDto,
  CreateDeviceDto,
  UpdateDeviceDto,
} from 'libs/api/infra-api/src/device/device.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageQueryDto, PageDto } from 'libs/common/src/pagination/pagination.dto';

@Injectable()
export class RestfulDeviceService implements IDeviceService {
  private serviceBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<DeviceDto | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/device/${id}`, {
      headers: {
        tenant: ctx.tenant,
      }
    });
  }

  async create(ctx: IRequestContext, device: CreateDeviceDto): Promise<DeviceDto> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/device`, device, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/device/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async update(ctx: IRequestContext, id: string, body: UpdateDeviceDto): Promise<DeviceDto> {
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
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<DeviceDto>> {
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
