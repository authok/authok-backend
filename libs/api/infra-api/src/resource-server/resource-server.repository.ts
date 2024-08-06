import { CreateResourceServerModel, ResourceServerModel, UpdateResourceServerModel, ResourceServerPageQuery } from './resource-server.model';
import { IContext } from '@libs/nest-core';
import { Page } from 'libs/common/src/pagination/pagination.model';

export interface IResourceServerRepository {
  create(
    ctx: IContext,
    resourceServer: CreateResourceServerModel,
  ): Promise<ResourceServerModel>;

  retrieve(
    ctx: IContext, 
    id: string,
  ): Promise<ResourceServerModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    data: UpdateResourceServerModel,
  ): Promise<ResourceServerModel>;

  delete(
    ctx: IContext, 
    id: string,
  ): Promise<void>;

  paginate(
    ctx: IContext,
    query: ResourceServerPageQuery,
  ): Promise<Page<ResourceServerModel>>;

  findByIdentifier(
    ctx: IContext,
    identifier: string,
  ): Promise<ResourceServerModel | undefined>;
}