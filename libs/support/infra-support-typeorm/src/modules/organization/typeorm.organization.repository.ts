import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import {
  OrganizationModel,
  OrganizationEnabledConnection,
  AddOrganizationEnabledConnection,
  UpdateOrganizationEnabledConnection,
  IOrganizationRepository,
  OrganizationMemberModel,
} from 'libs/api/infra-api/src';
import {
  OrganizationEntity,
} from './organization.entity';

import {
  MapperQueryRepository,
  getQueryRepositoryToken,
  Filter,
  Query,
  IContext,
  QueryRepository,
} from '@libs/nest-core';
import { OrganizationMapper } from './organization.mapper';
import { plainToClass } from 'class-transformer';
import { TenantAwareTypeOrmQueryRepository } from '@libs/nest-core-typeorm';
import { OrganizationEnabledConnectionEntity } from './enabled-connection.entity';
import { OrganizationEnabledConnectionMapper } from './organization-enabled-connection.mapper';
import { ConnectionEntity } from '../connection/connection.entity';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class TypeOrmOrganizationRepository
  extends MapperQueryRepository<OrganizationModel, OrganizationEntity>
  implements IOrganizationRepository
{
  constructor(
    readonly mapper: OrganizationMapper,
    readonly orgEnabledConnectionMapper: OrganizationEnabledConnectionMapper,
    @Inject(getQueryRepositoryToken(OrganizationEntity))
    readonly repo: TenantAwareTypeOrmQueryRepository<OrganizationEntity>,

    @Inject('OrganizationMemberMapperQueryRepository')
    readonly orgMemberRepo: QueryRepository<OrganizationMemberModel>,
    @Inject(getQueryRepositoryToken(OrganizationEnabledConnectionEntity))
    readonly orgEnabledConnectionRepo: TenantAwareTypeOrmQueryRepository<OrganizationEnabledConnectionEntity>,
  ) {
    super(mapper, repo);
  }

  async paginate(
    ctx: IContext,
    _query: PageQuery,
  ): Promise<Page<OrganizationModel>> {
    const filter = {
      and: [],
    } as Filter<OrganizationModel>;
    if (_query.org_id) {
      filter.and.push({
        id: {
          eq: _query.org_id,
        },
      });
    }

    const query = {
      paging: {
        offset: (_query.page - 1) * _query.per_page,
        limit: _query.per_page,
      },
      filter,
    } as Query<OrganizationModel>;

    const items = await this.query(ctx, query);
    const total = await this.count(ctx, query.filter);

    return {
      items,
      meta: {
        total,
        page: _query.page,
        per_page: _query.per_page,
      },
    };
  }

  async addMembers(
    ctx: IContext,
    org_id: string,
    user_ids: string[],
  ): Promise<OrganizationMemberModel[]> {
    const existingOrg = await this.queryOne(ctx, {
      and: [
        {
          id: {
            eq: org_id,
          },
        },
      ],
    });
    if (!existingOrg)
      throw new BadRequestException(`organization ${org_id} not found`);

    const exisitingMembers = await this.orgMemberRepo.query(ctx, {
      filter: {
        and: [
          {
            organization: {
              id: {
                eq: org_id,
              },
            },
          },
          {
            user: {
              tenant: {
                eq: ctx.tenant,
              },
              user_id: {
                in: user_ids,
              },
            },
          },
        ],
      },
    });

    /*
    const exisitingMembers = await memberRepo.find({
      where: {
        organization: {
          id: org_id,
        },
        user: {
          tenant: ctx.tenant,
          user_id: In(user_ids),
        }
      }
    });
    */

    const toAddUserIds = user_ids.filter(
      (user_id) => !exisitingMembers.some((it) => it.user.user_id === user_id),
    );

    const members = toAddUserIds.map((user_id) =>
      plainToClass(OrganizationMemberModel, {
        tenant: ctx.tenant,
        user_id: user_id,
        org_id,
      }),
    );

    const saved = await this.orgMemberRepo.createMany(ctx, members);

    // TODO to DTO

    return saved;
  }

  async removeMembers(
    ctx: IContext,
    org_id: string,
    user_ids: string[],
  ): Promise<void> {
    const existingOrg = await this.queryOne(ctx, {
      and: [
        {
          id: {
            eq: org_id,
          },
        },
      ],
    });
    if (!existingOrg)
      throw new BadRequestException(`organization ${org_id} not found`);

    const r = await this.orgMemberRepo.deleteMany(ctx, {
      and: [
        {
          organization: {
            id: {
              eq: org_id,
            },
          },
          user: {
            tenant: {
              eq: ctx.tenant,
            },
            user_id: {
              in: user_ids,
            },
          },
        },
      ],
    });

    console.log('删除成员结果: ', r);
  }

  async enabledConnections(
    ctx: IContext,
    org_id: string,
  ): Promise<Page<OrganizationEnabledConnection>> {
    const query = {
      filter: {
        and: [
          {
            organization_id: {
              eq: org_id,
            },
          },
        ],
      },
      paging: {
        offset: 0,
        limit: 100,
      },
    } as Query<OrganizationEnabledConnectionEntity>;

    /*
    const items = await this.queryRelations(ctx, OrganizationEnabledConnectionDto, 'enabled_connections', {
      id: org_id,
    } as OrganizationDto, {});

    const total = await this.countRelations(ctx, OrganizationEnabledConnectionDto, 'enabled_connections', {
      id: org_id
    } as OrganizationDto, {});
    */
    const entities = await this.orgEnabledConnectionRepo.query(ctx, query);
    const total = await this.orgEnabledConnectionRepo.count(ctx, query.filter);
    // 记录为空不能调用下面的关系查找，否则sql会报错
    if (entities.length > 0) {
      const connections = await this.orgEnabledConnectionRepo.findRelation(
        ctx,
        ConnectionEntity,
        'connection',
        entities,
      );
      entities.forEach((it) => {
        it.connection = connections.get(it);
      });
    }
    const items = await this.orgEnabledConnectionMapper.convertToDTOs(entities);

    return {
      items,
      meta: {
        page: 1,
        per_page: 100,
        total,
      },
    };

    /*
    const repo = await this.repo(ctx, OrganizationEntity);
  
    const organization = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id: org_id,
      },
      relations: ['enabled_connections'],
    });
    if (!organization) return undefined;

    return organization.enabled_connections.map(this.connectionMapper.toDTO);
    */
  }

  async addConnection(
    ctx: IContext,
    org_id: string,
    dto: AddOrganizationEnabledConnection,
  ): Promise<OrganizationEnabledConnection> {
    const entity = this.orgEnabledConnectionMapper.convertToCreateEntity(dto);
    entity.organization_id = org_id;

    return await this.orgEnabledConnectionMapper.convertAsyncToDTO(
      this.orgEnabledConnectionRepo.createOne(ctx, entity),
    );
  }

  async deleteConnection(
    ctx: IContext,
    org_id: string,
    connection_id: string,
  ): Promise<void> {
    await this.orgEnabledConnectionRepo.deleteOne(ctx, {
      connection_id,
      organization_id: org_id,
    });
  }

  async updateConnection(
    ctx: IContext,
    org_id: string,
    connection_id: string,
    data: UpdateOrganizationEnabledConnection,
  ): Promise<OrganizationEnabledConnection> {
    return await this.orgEnabledConnectionMapper.convertAsyncToDTO(
      this.orgEnabledConnectionRepo.updateOne(
        ctx,
        {
          connection_id,
          organization_id: org_id,
        },
        data,
      ),
    );
  }
}
