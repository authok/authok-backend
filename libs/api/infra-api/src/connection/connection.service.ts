import {
  ConnectionDto,
  CreateConnectionDto,
  UpdateConnectionDto,
} from './connection.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

export interface IConnectionService {
  findByName(ctx: IRequestContext, name: string): Promise<ConnectionDto | null>;

  retrieve(ctx: IRequestContext, id: string): Promise<ConnectionDto | null>;

  create(
    ctx: IRequestContext,
    input: CreateConnectionDto,
  ): Promise<ConnectionDto | null>;

  update(
    ctx: IRequestContext,
    id: string,
    input: UpdateConnectionDto,
  ): Promise<ConnectionDto | null>;

  delete(ctx: IRequestContext, id: string);

  paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<ConnectionDto>>;
}
