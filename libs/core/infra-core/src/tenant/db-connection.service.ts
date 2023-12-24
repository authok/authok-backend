import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DBConnectionDto } from 'libs/api/infra-api/src/tenant/db-connection.dto';
import { IDBConnectionService } from 'libs/api/infra-api/src/tenant/db-connection.service';
import { IDBConnectionRepository } from 'libs/api/infra-api/src/tenant/db-connection.repository';

@Injectable()
export class DBConnectionService implements IDBConnectionService {
  constructor(
    @Inject('IDBConnectionRepository')
    private readonly dbConnectionRepository: IDBConnectionRepository,
  ) {}

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<DBConnectionDto | undefined> {
    return await this.dbConnectionRepository.retrieve(ctx, id);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    body: Partial<DBConnectionDto>,
  ): Promise<{ affected?: number }> {
    return await this.dbConnectionRepository.update(ctx, id, body);
  }

  async delete(
    ctx: IRequestContext,
    id: string,
  ): Promise<{ affected?: number }> {
    return await this.dbConnectionRepository.delete(ctx, id);
  }

  async create(
    ctx: IRequestContext,
    conn: DBConnectionDto,
  ): Promise<DBConnectionDto> {
    return await this.dbConnectionRepository.create(ctx, conn);
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<DBConnectionDto>> {
    return await this.dbConnectionRepository.paginate(ctx, query);
  }
}
