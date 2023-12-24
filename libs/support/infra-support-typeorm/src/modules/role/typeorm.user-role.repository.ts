import { Injectable, Logger } from '@nestjs/common';
import { UserRoleDto } from 'libs/api/infra-api/src/user/user-role.dto';
import { IUserRoleRepository } from 'libs/api/infra-api/src/user/user-role.repository';
import { IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { UserRoleEntity } from './role.entity';
import { PageQueryDto, PageDto } from 'libs/common/src/pagination/pagination.dto';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TypeOrmUserRoleRepository
  extends TenantAwareRepository
  implements IUserRoleRepository {

  async update(
    ctx: IRequestContext,
    userRole: UserRoleDto,
  ): Promise<{ affected?: number; }> {
    // TODO
    return null;
  }

  async findBy(
    ctx: IRequestContext,
    userRole: UserRoleDto,
  ): Promise<UserRoleDto | undefined> {
    const repo = await this.repo(ctx, UserRoleEntity);
    const finded = await repo.findOne({
      where: {
        user: {
          user_id: userRole.user_id,
          tenant: ctx.tenant,
        },
        role: {
          id: userRole.role_id,
        },
      },
    });
    if (!finded) return null;

    return userRole;
  }

  async deleteBy(
    ctx: IRequestContext,
    userRole: UserRoleDto,
  ): Promise<{ affected?: number; }> {
    const repo = await this.repo(ctx, UserRoleEntity);
    const finded = await repo.findOne({
      where: {
        user: {
          user_id: userRole.user_id,
          tenant: ctx.tenant,
        },
        role: {
          id: userRole.role_id,
        },
      },
    });
    if (!finded) return;

    await finded.remove();
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<UserRoleDto | undefined> {
    const repo = await this.repo(ctx, UserRoleEntity);
    const userRole = await repo.findOne(id);
    if (!userRole) return undefined;

    return {
      user_id: userRole.user.user_id,
      role_id: userRole.role.id,
      created_at: userRole.created_at,
    };
  }

  async create(
    ctx: IRequestContext,
    userRole: UserRoleDto,
  ): Promise<UserRoleDto> {
    const repo = await this.repo(ctx, UserRoleEntity);
    const newUserRole = await repo.save({
      role: {
        id: userRole.role_id,
      },
      user: {
        user_id: userRole.user_id,
        tenant: ctx.tenant,
      },
    });

    return {
      user_id: newUserRole.user.user_id,
      role_id: newUserRole.role.id,
      created_at: newUserRole.created_at,
    };
  }

  async batchCreate(
    ctx: IRequestContext,
    _userRoles: Partial<UserRoleDto>[],
  ): Promise<Partial<UserRoleDto>[]> {
    const repo = await this.repo(ctx, UserRoleEntity);
    const userRoles = _userRoles.map((it) => repo.create({
        role: {
          id: it.role_id,
        },
        user: {
          user_id: it.user_id,
          tenant: ctx.tenant,
        },
      }),
    );

    await repo.save(userRoles);

    return _userRoles;
  }

  async batchDelete(
    ctx: IRequestContext,
    userRoles: Partial<UserRoleDto>[],  
  ): Promise<void> {
    const repo = await this.repo(ctx, UserRoleEntity);

    Logger.log('user-role to delete: ', userRoles);

    for (const userRole of userRoles) {
      await repo.delete({
        role: {
          id: userRole.role_id,
        },
        user: {
          user_id: userRole.user_id,
          tenant: ctx.tenant,
        }, 
      });
      Logger.log('user-role deleted', userRole);
    }
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<UserRoleDto>> {
    const repo = await this.repo(ctx, UserRoleEntity);

    query.tenant = ctx.tenant;
    const page = await paginate(repo, query, ['user.user_id', 'role.id']);
    return {
      meta: page.meta,
      items: page.items.map(it => (plainToClass(UserRoleDto, {
        user_id: it.user_id,
        role: it.role,
        created_at: it.created_at,
      }))),
    }
  }
}
