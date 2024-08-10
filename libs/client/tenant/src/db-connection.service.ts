import { IContext, IRequestContext } from '@libs/nest-core';
import { Injectable } from '@nestjs/common';
import { DBConnectionModel, IDBConnectionService } from 'libs/api/infra-api/src';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class DBConnectionService implements IDBConnectionService {
  constructor(
  ) {}

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<DBConnectionModel | undefined> {
    return null;
  }

  async update(
    ctx: IContext,
    id: string,
    body: Partial<DBConnectionModel>,
  ): Promise<{ affected?: number }> {
    return null;
  }

  async delete(
    ctx: IRequestContext,
    id: string,
  ): Promise<{ affected?: number }> {
    return null;
  }

  async create(
    ctx: IContext,
    conn: DBConnectionModel,
  ): Promise<DBConnectionModel> {
    return null;
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<DBConnectionModel>> {
    return null;
  }
}
