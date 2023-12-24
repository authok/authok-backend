import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IOrganizationService } from 'libs/api/infra-api/src/organization/organization.service';
import {
  OrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from 'libs/api/infra-api/src/organization/organization.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

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
    ctx: IRequestContext,
    name: string,
  ): Promise<OrganizationDto | undefined> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/organizations/name/${name}`, {
        headers: {
          tenant: ctx.tenant,
        },
      }
    );
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<OrganizationDto | undefined> {
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
    ctx: IRequestContext,
    data: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
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
    ctx: IRequestContext,
    id: string,
    input: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
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

  async delete(ctx: IRequestContext, id: string) {
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
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>> {
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
