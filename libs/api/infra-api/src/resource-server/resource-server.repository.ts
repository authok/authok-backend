import { CreateResourceServerDto, ResourceServerDto, UpdateResourceServerDto, ResourceServerPageQueryDto } from './resource-server.dto';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IContext } from '@libs/nest-core';

export interface IResourceServerRepository {
  create(
    ctx: IContext,
    resourceServer: CreateResourceServerDto,
  ): Promise<ResourceServerDto>;

  retrieve(
    ctx: IContext, 
    id: string,
  ): Promise<ResourceServerDto | undefined>;

  update(
    ctx: IContext,
    id: string,
    data: UpdateResourceServerDto,
  ): Promise<ResourceServerDto>;

  delete(
    ctx: IContext, 
    id: string,
  ): Promise<void>;

  paginate(
    ctx: IContext,
    query: ResourceServerPageQueryDto,
  ): Promise<PageDto<ResourceServerDto>>;

  findByIdentifier(
    ctx: IContext,
    identifier: string,
  ): Promise<ResourceServerDto | undefined>;
}
