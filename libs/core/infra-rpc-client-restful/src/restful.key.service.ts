import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IKeyService } from 'libs/api/infra-api/src/key/key.service';
import {
  CreateKeyDto,
  KeyDto,
  UpdateKeyDto,
} from 'libs/api/infra-api/src/key/key.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

@Injectable()
export class RestfulKeyService implements IKeyService {
  private serviceBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<KeyDto | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/key/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async findByIds(ctx: IRequestContext, ids: string[]): Promise<KeyDto[]> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/key/findByIds/${ids.join(',')}`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      }
    );
  }

  async create(ctx: IRequestContext, input: CreateKeyDto): Promise<KeyDto> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/key`, input, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async update(ctx: IRequestContext, id: string, input: UpdateKeyDto): Promise<KeyDto> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/key/${id}`,
      input,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async delete(ctx: IRequestContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/key/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async findActiveKey(ctx: IRequestContext): Promise<KeyDto> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/key/findActiveKey`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<KeyDto>> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/keys`,
      {
        params: query,
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async findAll(ctx: IRequestContext): Promise<KeyDto[]> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/keys/findAll`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      }
    );
  }
}
