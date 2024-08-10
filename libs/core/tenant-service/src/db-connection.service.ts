import { IContext } from '@libs/nest-core';
import { Inject, Injectable } from '@nestjs/common';
import { 
  DBConnectionModel,
  IDBConnectionService,
  IDBConnectionRepository,
 } from 'libs/api/infra-api/src';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class DBConnectionService implements IDBConnectionService {
  constructor(
    @Inject('IDBConnectionRepository')
    private readonly dbConnectionRepository: IDBConnectionRepository,
  ) {}

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<DBConnectionModel | undefined> {
    return await this.dbConnectionRepository.retrieve(ctx, id);
  }

  async update(
    ctx: IContext,
    id: string,
    body: Partial<DBConnectionModel>,
  ): Promise<{ affected?: number }> {
    return await this.dbConnectionRepository.update(ctx, id, body);
  }

  async delete(
    ctx: IContext,
    id: string,
  ): Promise<{ affected?: number }> {
    return await this.dbConnectionRepository.delete(ctx, id);
  }

  async create(
    ctx: IContext,
    conn: DBConnectionModel,
  ): Promise<DBConnectionModel> {
    return await this.dbConnectionRepository.create(ctx, conn);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<DBConnectionModel>> {
    return await this.dbConnectionRepository.paginate(ctx, query);
  }
}