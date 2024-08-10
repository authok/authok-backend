import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { 
  IOrganizationService,
  OrganizationModel,
  CreateOrganizationModel,
  UpdateOrganizationModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class RestfulOrganizationService implements IOrganizationService {
  private serviceBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<OrganizationModel | undefined> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/organizations/name/${name}`, {
        headers: {
          tenant: ctx.tenant,
        },
      }
    );
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<OrganizationModel | undefined> {
    // TODO 从微服务获取数据
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/organizations/${id}`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async create(
    ctx: IContext,
    data: CreateOrganizationModel,
  ): Promise<OrganizationModel> {
    return await this.promisifyHttp.post(
      `${this.serviceBaseUrl}/organizations`,
      data,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async update(
    ctx: IContext,
    id: string,
    input: UpdateOrganizationModel,
  ): Promise<OrganizationModel> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/organizations/${id}`,
      input,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async delete(ctx: IContext, id: string) {
    await this.promisifyHttp.delete(
      `${this.serviceBaseUrl}/organizations/${id}`,
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
  ): Promise<Page<OrganizationModel>> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/organizations`,
      {
        params: query,
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }
}
