import { IContext, IRequestContext } from '@libs/nest-core';
import {
  PageDto,
  PageMeta,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { IDBConnectionRepository } from 'libs/api/infra-api/src/tenant/db-connection.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DBConnection } from './db-connection.entity';
import { Repository } from 'typeorm';
import { DBConnectionModel } from 'libs/api/infra-api/src/tenant/db-connection.model';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export class TypeOrmDBConnectionRepository implements IDBConnectionRepository {
  constructor(
    @InjectRepository(DBConnection)
    private readonly repo: Repository<DBConnection>,
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
      limit: query.page_size,
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        page_size: meta.itemsPerPage,
      }),
    };

    const result = await paginate<DBConnection, PageMeta>(this.repo, options);

    return {
      items: result.items,
      meta: result.meta,
    };
  }
}
