import { IRequestContext } from '@libs/nest-core';
import {
  PageDto,
  PageMeta,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { IDBConnectionRepository } from 'libs/api/infra-api/src/tenant/db-connection.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DBConnection } from './db-connection.entity';
import { Repository } from 'typeorm';
import { DBConnectionDto } from 'libs/api/infra-api/src/tenant/db-connection.dto';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';

export class TypeOrmDBConnectionRepository implements IDBConnectionRepository {
  constructor(
    @InjectRepository(DBConnection)
    private readonly repo: Repository<DBConnection>,
  ) {}

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<DBConnectionDto | undefined> {
    return await this.repo.findOne(id);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    body: Partial<DBConnectionDto>,
  ): Promise<{ affected?: number }> {
    return await this.repo.update(id, body);
  }

  async delete(
    ctx: IRequestContext,
    id: string,
  ): Promise<{ affected?: number }> {
    return await this.repo.delete(id);
  }

  async create(
    ctx: IRequestContext,
    conn: DBConnectionDto,
  ): Promise<DBConnectionDto> {
    return await this.repo.save(this.repo.create(conn));
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<DBConnectionDto>> {
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
