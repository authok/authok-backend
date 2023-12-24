import { ResourceServerDto, CreateResourceServerDto, UpdateResourceServerDto, ResourceServerPageQueryDto } from './resource-server.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';

export interface IResourceServerService {
  create(
    ctx: IRequestContext, 
    resourceServer: Partial<CreateResourceServerDto>,
  ): Promise<ResourceServerDto>;

  retrieve(
    ctx: IRequestContext, 
    id: string,
  ): Promise<ResourceServerDto | undefined>;

  update(
    ctx: IRequestContext,
    id: string,
    data: UpdateResourceServerDto,
  ): Promise<Partial<ResourceServerDto>>;

  delete(ctx: IRequestContext, id: string): Promise<void>;
  
  paginate(
    ctx: IRequestContext,
    query: ResourceServerPageQueryDto,
  ): Promise<PageDto<ResourceServerDto>>;

  findByIdentifier(
    ctx: IRequestContext,
    identifier: string,
  ): Promise<ResourceServerDto | undefined>;
}
