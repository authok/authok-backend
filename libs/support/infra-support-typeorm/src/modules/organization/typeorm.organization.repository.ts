import { IOrganizationRepository } from 'libs/api/infra-api/src/organization/organization.repository';
import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  OrganizationDto,
  OrganizationEnabledConnectionDto,
  AddOrganizationEnabledConnectionDto,
  UpdateOrganizationEnabledConnectionDto,
} from 'libs/api/infra-api/src/organization/organization.dto';
import {
  OrganizationEntity,
  OrganizationMemberEntity,
} from './organization.entity';

import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import {
  IRequestContext,
  MapperQueryRepository,
  getQueryRepositoryToken,
  Filter,
  Query,
  IContext,
  QueryRepository,
} from '@libs/nest-core';
import { OrganizationMapper } from './organization.mapper';
import { plainToClass } from 'class-transformer';
import { OrganizationMemberDto } from 'libs/api/infra-api/src/organization/organization-member.dto';
import { TenantAwareTypeOrmQueryRepository } from '@libs/nest-core-typeorm';
import { OrganizationEnabledConnectionEntity } from './enabled-connection.entity';
import { OrganizationEnabledConnectionMapper } from './organization-enabled-connection.mapper';
import { ConnectionEntity } from '../connection/connection.entity';

@Injectable()
export class TypeOrmOrganizationRepository
  extends MapperQueryRepository<OrganizationDto, OrganizationEntity>
  implements IOrganizationRepository
{
  constructor(
    readonly mapper: OrganizationMapper,
    readonly orgEnabledConnectionMapper: OrganizationEnabledConnectionMapper,
    @Inject(getQueryRepositoryToken(OrganizationEntity))
    readonly repo: TenantAwareTypeOrmQueryRepository<OrganizationEntity>,

    @Inject('OrganizationMemberMapperQueryRepository')
    readonly orgMemberRepo: QueryRepository<OrganizationMemberDto>,
    @Inject(getQueryRepositoryToken(OrganizationEnabledConnectionEntity))
    readonly orgEnabledConnectionRepo: TenantAwareTypeOrmQueryRepository<OrganizationEnabledConnectionEntity>,
  ) {
    super(mapper, repo);
  }

  async paginate(
    ctx: IRequestContext,
    _query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>> {
    const filter = {
      and: [],
    } as Filter<OrganizationDto>;
    if (_query.org_id) {
      filter.and.push({
        id: {
          eq: _query.org_id,
        },
      });
    }

    const query = {
      paging: {
        offset: (_query.page - 1) * _query.page_size,
        limit: _query.page_size,
      },
      filter,
    } as Query<OrganizationDto>;

    const items = await this.query(ctx, query);
    const total = await this.count(ctx, query.filter);

    return {
      items,
      meta: {
        total,
        page: _query.page,
        page_size: _query.page_size,
      },
    };
  }

  async addMembers(
    ctx: IRequestContext,
    org_id: string,
    user_ids: string[],
  ): Promise<OrganizationMemberDto[]> {
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
      plainToClass(OrganizationMemberEntity, {
        tenant: ctx.tenant,
        user_id: user_id,
        org_id,
      }),
    );

    const saved = await this.orgMemberRepo.createMany(ctx, members);
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
  ): Promise<PageDto<OrganizationEnabledConnectionDto>> {
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
        page_size: 100,
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
    dto: AddOrganizationEnabledConnectionDto,
  ): Promise<OrganizationEnabledConnectionDto> {
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
    data: UpdateOrganizationEnabledConnectionDto,
  ): Promise<OrganizationEnabledConnectionDto> {
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
