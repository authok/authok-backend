import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { DBConnectionDto } from './db-connection.dto';

export interface IDBConnectionService {
  retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<DBConnectionDto | undefined>;

  update(
    ctx: IRequestContext,
    id: string,
    body: Partial<DBConnectionDto>,
  ): Promise<{ affected?: number }>;

  delete(ctx: IRequestContext, id: string): Promise<{ affected?: number }>;

  create(ctx: IRequestContext, conn: DBConnectionDto): Promise<DBConnectionDto>;

  paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<DBConnectionDto>>;
}
