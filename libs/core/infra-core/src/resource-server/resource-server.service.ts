import {
  Injectable,
  Inject,
  HttpStatus,
} from '@nestjs/common';

import {
  CreateResourceServerDto,
  ResourceServerDto,
  UpdateResourceServerDto,
  ResourceServerPageQueryDto,
} from 'libs/api/infra-api/src/resource-server/resource-server.dto';
import { IResourceServerRepository } from 'libs/api/infra-api/src/resource-server/resource-server.repository';
import { IResourceServerService } from 'libs/api/infra-api/src/resource-server/resource-server.service';
import { APIException } from 'libs/common/src/exception/api.exception';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';

@Injectable()
export class ResourceServerService implements IResourceServerService {
  constructor(
    @Inject('IResourceServerRepository') private resourceServerRepo: IResourceServerRepository,
  ) {}

  retrieve(ctx: IRequestContext, id: string): Promise<ResourceServerDto | undefined> {
    return this.resourceServerRepo.retrieve(ctx, id);
  }

  findByIdentifier(
    ctx: IRequestContext,
    identifier: string,
  ): Promise<ResourceServerDto | null> {
    return this.resourceServerRepo.findByIdentifier(ctx, identifier);
  }

  async create(
    ctx: IRequestContext,
    body: Partial<CreateResourceServerDto>,
  ): Promise<ResourceServerDto> {
    const existingApi = await this.resourceServerRepo.findByIdentifier(
      ctx,
      body.identifier,
    );
    if (existingApi)
      throw new APIException(
        'invalid request',
        'identifier不能和已有的重复',
        HttpStatus.CONFLICT,
      );

    return await this.resourceServerRepo.create(ctx, body);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    this.resourceServerRepo.delete(ctx, id);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: UpdateResourceServerDto,
  ): Promise<ResourceServerDto> {
    return await this.resourceServerRepo.update(ctx, id, data);
  }

  async paginate(
    ctx: IRequestContext,
    query: ResourceServerPageQueryDto,
  ): Promise<PageDto<ResourceServerDto>> {
    return await this.resourceServerRepo.paginate(ctx, query);
  }
}
