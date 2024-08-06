import { Injectable, Inject } from '@nestjs/common';
import { InvitationEntity } from './invitation.entity';
import {
  MapperQueryRepository,
  IContext,
  getQueryRepositoryToken,
  Filter,
  Query,
} from '@libs/nest-core';
import { IInvitationRepository } from 'libs/api/infra-api/src/invitation/invitation.repository';
import { InvitationModel } from 'libs/api/infra-api/src/invitation/invitation.model';
import { InvitationMapper } from './invitation.mapper';
import { TenantAwareTypeOrmQueryRepository } from '@libs/nest-core-typeorm';
import {
  PageQueryDto,
  PageDto,
} from 'libs/common/src/pagination/pagination.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class TypeOrmInvitationRepository
  extends MapperQueryRepository<InvitationModel, InvitationEntity>
  implements IInvitationRepository
{
  constructor(
    readonly mapper: InvitationMapper,
    @Inject(getQueryRepositoryToken(InvitationEntity))
    readonly repo: TenantAwareTypeOrmQueryRepository<InvitationEntity>,
  ) {
    super(mapper, repo);
  }

  async findByTicket(
    ctx: IContext,
    ticket: string,
  ): Promise<InvitationModel | undefined> {
    return this.queryOne(ctx, {
      and: [
        {
          tenant: {
            eq: ctx.tenant,
          },
        },
        {
          ticket: {
            eq: ticket,
          },
        },
      ],
    });
  }

  async paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<InvitationModel>> {
    const {
      page,
      page_size,
      q,
      include_fields,
      include_totals,
      fields,
      sort,
      ...rest
    } = query;

    const filter = {
      and: Object.entries(rest).map(([key, value]) => {
        const q = {};
        q[key] = { eq: value };
        return q;
      }),
    } as Filter<InvitationEntity>;

    const _query = {
      filter,
    } as Query<InvitationEntity>;

    const items = await this.repo.query(ctx, _query);
    const total = await this.repo.count(ctx, _query.filter);

    if (items.length > 0) {
      const inviters = await this.repo.findRelation(
        ctx,
        UserEntity,
        'inviter',
        items,
      );

      items.forEach((it) => {
        it.inviter = inviters.get(it);
      });
    }

    return {
      meta: {
        total,
        page,
        page_size,
      },
      items: this.mapper.convertToDTOs(items),
    };
  }
}
