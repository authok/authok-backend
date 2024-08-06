import { Injectable, Inject } from '@nestjs/common';
import {
  PasswordResetDto,
} from 'libs/api/infra-api/src/password-reset/password-reset.dto';
import { IPasswordResetRepository } from 'libs/api/infra-api/src/password-reset/password-reset.repository';
import { PasswordResetEntity } from './password-reset.entity';
import { IRequestContext, IContext, Query, Filter, MapperQueryRepository, Mapper, getQueryRepositoryToken } from '@libs/nest-core';
import { TenantAwareTypeOrmQueryRepository } from '@libs/nest-core-typeorm';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { PasswordResetMapper } from './password-rest.mapper';

@Injectable()
export class TypeOrmPasswordResetRepository
  extends MapperQueryRepository<PasswordResetDto, PasswordResetEntity>
  implements IPasswordResetRepository {

  constructor(
    readonly mapper: PasswordResetMapper,
    @Inject(getQueryRepositoryToken(PasswordResetEntity))
    readonly repo: TenantAwareTypeOrmQueryRepository<PasswordResetEntity>
  ) {
    super(mapper, repo)
  }

  async findByToken(
    ctx: IRequestContext,
    token: string,
  ): Promise<PasswordResetDto | undefined> {
    return await this.queryOne(ctx, {
      and: [
        {
          token: {
            eq: token,
          }
        }
      ]
    });
  }

  async paginate(ctx: IContext, query: PageQuery): Promise<Page<PasswordResetDto>> {
    const { page, page_size, ...rest } = query;

    const _query = {
      filter: rest,
    } as Query<PasswordResetDto>;

    const items = await this.query(ctx, _query);
    const total = await this.count(ctx, rest as Filter<PasswordResetDto>);

    return {
      meta: {
        total,
        page,
        page_size,
      },
      items,
    };
  }
}
