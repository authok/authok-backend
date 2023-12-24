import {
  ConnectionDto,
  CreateConnectionDto,
  UpdateConnectionDto,
} from './connection.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

export interface IConnectionRepository {
  findByName(
    ctx: IRequestContext,
    name: string,
  ): Promise<ConnectionDto | undefined>;

  retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<ConnectionDto | undefined>;

  create(
    ctx: IRequestContext,
    input: CreateConnectionDto,
  ): Promise<ConnectionDto>;

  update(
    ctx: IRequestContext,
    id: string,
    input: UpdateConnectionDto,
  ): Promise<void>;

  delete(ctx: IRequestContext, id: string): Promise<{ affected?: number }>;

  paginate(
    ctx: IRequestContext,
    page: PageQueryDto,
  ): Promise<PageDto<ConnectionDto>>;
}
