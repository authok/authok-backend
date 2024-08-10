import { Injectable, Logger } from '@nestjs/common';
import { 
  UserRoleModel,
  IUserRoleRepository,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { UserRoleEntity } from './role.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { plainToClass } from 'class-transformer';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class TypeOrmUserRoleRepository
  extends TenantAwareRepository
  implements IUserRoleRepository {

  async update(
    ctx: IContext,
    userRole: UserRoleModel,
  ): Promise<{ affected?: number; }> {
    // TODO
    return null;
  }

  async findBy(
    ctx: IContext,
    userRole: UserRoleModel,
  ): Promise<UserRoleModel | undefined> {
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
    ctx: IContext,
    userRole: UserRoleModel,
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
    ctx: IContext,
    id: string,
  ): Promise<UserRoleModel | undefined> {
    const repo = await this.repo(ctx, UserRoleEntity);
    const userRole = await repo.findOne({
      where: { id },
    });
    if (!userRole) return undefined;

    return {
      user_id: userRole.user.user_id,
      role_id: userRole.role.id,
      created_at: userRole.created_at,
    };
  }

  async create(
    ctx: IContext,
    userRole: UserRoleModel,
  ): Promise<UserRoleModel> {
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
    ctx: IContext,
    _userRoles: Partial<UserRoleModel>[],
  ): Promise<Partial<UserRoleModel>[]> {
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
    ctx: IContext,
    userRoles: Partial<UserRoleModel>[],  
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
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<UserRoleModel>> {
    const repo = await this.repo(ctx, UserRoleEntity);

    query.tenant = ctx.tenant;
    const page = await paginate(repo, query, ['user.user_id', 'role.id']);
    return {
      meta: page.meta,
      items: page.items.map(it => (plainToClass(UserRoleModel, {
        user_id: it.user_id,
        role: it.role,
        created_at: it.created_at,
      }))),
    }
  }
}
