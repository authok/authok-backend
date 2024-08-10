import { Injectable, Inject } from '@nestjs/common';
import { 
  IPasswordResetRepository,
  PasswordResetModel,
} from 'libs/api/infra-api/src';
import { PasswordResetEntity } from './password-reset.entity';
import { IRequestContext, IContext, Query, Filter, MapperQueryRepository, Mapper, getQueryRepositoryToken } from '@libs/nest-core';
import { TenantAwareTypeOrmQueryRepository } from '@libs/nest-core-typeorm';
import { PageQuery, Page } from 'libs/common/src/pagination';
import { PasswordResetMapper } from './password-rest.mapper';

@Injectable()
export class TypeOrmPasswordResetRepository
  extends MapperQueryRepository<PasswordResetModel, PasswordResetEntity>
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
  ): Promise<PasswordResetModel | undefined> {
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

  async paginate(ctx: IContext, query: PageQuery): Promise<Page<PasswordResetModel>> {
    const { page, per_page, ...rest } = query;

    const _query = {
      filter: rest,
    } as Query<PasswordResetModel>;

    const items = await this.query(ctx, _query);
    const total = await this.count(ctx, rest as Filter<PasswordResetModel>);

    return {
      meta: {
        total,
        page,
        per_page,
      },
      items,
    };
  }
}
