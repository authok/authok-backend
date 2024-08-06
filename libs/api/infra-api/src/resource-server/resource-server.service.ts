import { ResourceServerModel, CreateResourceServerModel, UpdateResourceServerModel, ResourceServerPageQuery } from './resource-server.model';
import { IContext } from '@libs/nest-core';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';

export interface IResourceServerService {
  create(
    ctx: IContext, 
    resourceServer: Partial<CreateResourceServerModel>,
  ): Promise<ResourceServerModel>;

  retrieve(
    ctx: IContext, 
    id: string,
  ): Promise<ResourceServerModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    data: UpdateResourceServerModel,
  ): Promise<Partial<ResourceServerModel>>;

  delete(ctx: IContext, id: string): Promise<void>;
  
  paginate(
    ctx: IContext,
    query: ResourceServerPageQuery,
  ): Promise<PageDto<ResourceServerModel>>;

  findByIdentifier(
    ctx: IContext,
    identifier: string,
  ): Promise<ResourceServerModel | undefined>;
}