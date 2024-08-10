import { IContext } from '@libs/nest-core';
import { DBConnectionEntity } from './db-connection.entity';
import { Repository } from 'typeorm';
import { 
  DBConnectionModel,
  IDBConnectionRepository,
} from 'libs/api/infra-api/src';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Page, PageQuery, PageMeta } from 'libs/common/src/pagination';
import { InjectRepository } from '@nestjs/typeorm';

export class TypeOrmDBConnectionRepository implements IDBConnectionRepository {
  constructor(
    @InjectRepository(DBConnectionEntity)
    private readonly repo: Repository<DBConnectionEntity>,
  ) {}

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<DBConnectionModel | undefined> {
    return await this.repo.findOne({
      where: { id },
    });
  }

  async update(
    ctx: IContext,
    id: string,
    body: Partial<DBConnectionModel>,
  ): Promise<{ affected?: number }> {
    return await this.repo.update(id, body);
  }

  async delete(
    ctx: IContext,
    id: string,
  ): Promise<{ affected?: number }> {
    return await this.repo.delete(id);
  }

  async create(
    ctx: IContext,
    conn: DBConnectionModel,
  ): Promise<DBConnectionModel> {
    return await this.repo.save(this.repo.create(conn));
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<DBConnectionModel>> {
    const options: IPaginationOptions<PageMeta> = {
      limit: query.per_page,
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        per_page: meta.itemsPerPage,
      }),
    };

    const result = await paginate<DBConnectionEntity, PageMeta>(this.repo, options);

    return {
      items: result.items,
      meta: result.meta,
    };
  }
}
