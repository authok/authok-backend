import {
  Injectable,
  Inject,
  HttpStatus,
} from '@nestjs/common';

import {
  CreateResourceServerModel,
  ResourceServerModel,
  UpdateResourceServerModel,
  ResourceServerPageQuery,
  IResourceServerRepository,
  IResourceServerService,
} from 'libs/api/infra-api/src';
import { APIException } from 'libs/common/src/exception/api.exception';
import { IContext, IRequestContext } from '@libs/nest-core';
import { Page } from 'libs/common/src/pagination';

@Injectable()
export class ResourceServerService implements IResourceServerService {
  constructor(
    @Inject('IResourceServerRepository') private resourceServerRepo: IResourceServerRepository,
  ) {}

  retrieve(ctx: IRequestContext, id: string): Promise<ResourceServerModel | undefined> {
    return this.resourceServerRepo.retrieve(ctx, id);
  }

  findByIdentifier(
    ctx: IContext,
    identifier: string,
  ): Promise<ResourceServerModel | null> {
    return this.resourceServerRepo.findByIdentifier(ctx, identifier);
  }

  async create(
    ctx: IContext,
    body: Partial<CreateResourceServerModel>,
  ): Promise<ResourceServerModel> {
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

  async delete(ctx: IContext, id: string): Promise<void> {
    this.resourceServerRepo.delete(ctx, id);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: UpdateResourceServerModel,
  ): Promise<ResourceServerModel> {
    return await this.resourceServerRepo.update(ctx, id, data);
  }

  async paginate(
    ctx: IContext,
    query: ResourceServerPageQuery,
  ): Promise<Page<ResourceServerModel>> {
    return await this.resourceServerRepo.paginate(ctx, query);
  }
}