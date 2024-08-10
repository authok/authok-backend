import {
  Injectable,
  NotFoundException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  FindManyOptions,
  In,
  EntityManager,
  Equal,
} from 'typeorm';
import { UserEntity } from './user.entity';
import {
  IdentityModel,
  LinkIdentityReq,
  IUserRepository,
  PermissionModel,
  PermissionSourceModel,
  OrganizationModel,
  PostPermissions, 
  UserModel,
} from 'libs/api/infra-api/src';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { IContext } from '@libs/nest-core';
import { PermissionEntity } from '../permission/permission.entity';
import { RoleEntity } from '../role/role.entity';
import * as _ from 'lodash';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { IdentityEntity } from '../identity/identity.entity';
import { PhoneParser } from 'libs/shared/src/services/phone.parser';
import { UserGroupEntity } from '../group/user-group.entity';
import { UserMapper } from './user.mapper';
import { OrganizationMemberEntity } from '../organization/organization.entity';
import { OrganizationMapper } from '../organization/organization.mapper';
import { APIException } from 'libs/common/src/exception/api.exception';
import { FindOptions } from 'libs/common/src/types';
import { Page, PageMeta, PageQuery } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class TypeOrmUserRepository
  extends TenantAwareRepository
  implements IUserRepository
{
  @Inject()
  private readonly userMapper: UserMapper;

  @Inject()
  private readonly phoneParser: PhoneParser;

  async create(
    ctx: IContext,
    _user: UserModel,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);

    const user = this.userMapper.toEntity(ctx, _user);

    console.log('save identities: ', user.identities);

    if (_user.phone_number) {
      const r = this.phoneParser.parse(_user.phone_number);
      user.phone_number = r.phone_number;
      user.phone_country_code = r.phone_country_code;
    }

    const result = await userRepo.save(user);

    return this.userMapper.toDTO(result);
  }

  async getUserWithPasswordByEmail(
    ctx: IContext,
    connection: string,
    email: string,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);

    const user = await userRepo
      .createQueryBuilder('user')
      .leftJoin('user.identities', 'identities')
      .addSelect('user.password')
      .where(
        `user.tenant = :tenant AND user.email = :email AND identities.connection = :connection`,
        {
          tenant: ctx.tenant,
          email,
          connection,
        },
      )
      .getOne();

    return this.userMapper.toDTO(user);
  }

  async getUserWithPasswordByUsername(
    ctx: IContext,
    connection: string,
    username: string,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);

    const user = await userRepo
      .createQueryBuilder('user')
      .leftJoin('user.identities', 'identities')
      .addSelect('user.password')
      .where(
        `user.tenant = :tenant AND user.username = :username AND identities.connection = :connection`,
        {
          tenant: ctx.tenant,
          username,
          connection,
        },
      )
      .getOne();

    return this.userMapper.toDTO(user);
  }

  async retrieve(
    ctx: IContext,
    user_id: string,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);
    const user = await userRepo.findOne({
      where: {
        tenant: Equal(ctx.tenant),
        user_id: Equal(user_id),
      },
    });
    return this.userMapper.toDTO(user);
  }

  async findByGuid(
    ctx: IContext,
    guid: string,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);
    const user = await userRepo.findOne({
      where: {
        id: guid,
      },
    });
    return this.userMapper.toDTO(user);
  }

  async findByUserIds(
    ctx: IContext,
    user_ids: string[],
  ): Promise<Partial<UserModel>[]> {
    const userRepo = await this.repo(ctx, UserEntity);
    const users = await userRepo.find({
      where: {
        tenant: ctx.tenant,
        user_id: In(user_ids),
      },
    });

    return users.map(this.userMapper.toDTO);
  }

  async findByEmail(
    ctx: IContext,
    connection: string,
    email: string,
    options?: FindOptions,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);

    const qb = userRepo
      .createQueryBuilder('user')
      .leftJoin('user.identities', 'identities')
      .where(
        `user.tenant = :tenant AND user.email = :email AND identities.connection = :connection`,
        {
          tenant: ctx.tenant,
          email,
          connection,
        },
      );

    if (options) {
      !_.isEmpty(options.select) &&
        qb.addSelect(options.select.map((it) => `${qb.alias}.${it}`));
      !_.isEmpty(options.addSelect) &&
        qb.addSelect(options.addSelect.map((it) => `${qb.alias}.${it}`));
    }

    const user = await qb.getOne();
    return this.userMapper.toDTO(user);
  }

  async findByPhoneNumber(
    ctx: IContext,
    connection: string,
    _phone_number: string,
    options?: FindOptions,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);
    const { phone_number, phone_country_code } =
      this.phoneParser.parse(_phone_number);

    console.log('phone_country_codexx: ', phone_country_code, phone_number);

    const qb = await userRepo
      .createQueryBuilder('user')
      .leftJoin('user.identities', 'identities')
      .where(
        `user.tenant = :tenant AND user.phone_number = :phone_number AND identities.connection = :connection`,
        {
          tenant: ctx.tenant,
          phone_number,
          connection,
        },
      );

    if (options) {
      !_.isEmpty(options.select) &&
        qb.addSelect(options.select.map((it) => `${qb.alias}.${it}`));
      !_.isEmpty(options.addSelect) &&
        qb.addSelect(options.addSelect.map((it) => `${qb.alias}.${it}`));
    }

    const user = await qb.getOne();
    return this.userMapper.toDTO(user);
  }

  async findByUsername(
    ctx: IContext,
    connection: string,
    username: string,
    options?: FindOptions,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);

    const qb = userRepo
      .createQueryBuilder('user')
      .leftJoin('user.identities', 'identities')
      .where(
        `user.tenant = :tenant AND user.username = :username AND identities.connection = :connection`,
        {
          tenant: ctx.tenant,
          username,
          connection,
        },
      );

    if (options) {
      !_.isEmpty(options.select) &&
        qb.addSelect(options.select.map((it) => `${qb.alias}.${it}`));
      !_.isEmpty(options.addSelect) &&
        qb.addSelect(options.addSelect.map((it) => `${qb.alias}.${it}`));
    }

    const user = await qb.getOne();
    return this.userMapper.toDTO(user);
  }

  async update(
    ctx: IContext,
    user_id: string,
    _data: UserModel,
  ): Promise<UserModel> {
    const userRepo = await this.repo(ctx, UserEntity);
    const existingUser = await userRepo.findOneOrFail({
      select: ['id', 'created_at'],
      where: {
        tenant: ctx.tenant,
        user_id,
      },
    });

    // 这里不处理 groups 和 roles
    const { password, groups, roles, ...rest } = _data;

    const data = this.userMapper.toEntity(ctx, rest);
    data.id = existingUser.id;
    if (password) data.password = password;

    if (!data.phone_country_code) {
      const r = this.phoneParser.parse(_data.phone_number);
      data.phone_number = r.phone_number;
      data.phone_country_code = r.phone_country_code;
    }

    await userRepo.save(data);

    const user = await userRepo.findOne({
      where: {
        tenant: ctx.tenant,
        user_id,
      },
    });

    return this.userMapper.toDTO(user);
  }

  async delete(
    ctx: IContext,
    user_id: string,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);
    const _user = await userRepo.findOne({
      where: {
        tenant: ctx.tenant,
        user_id,
      }
    });

    if (!_user) throw new NotFoundException();

    const user = await userRepo.remove(_user);

    return this.userMapper.toDTO(user);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<UserModel>> {
    const userRepo = await this.repo(ctx, UserEntity);

    const options: IPaginationOptions<PageMeta> = {
      limit: Math.min(query.per_page, 100),
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        per_page: meta.itemsPerPage,
      }),
    };

    const searchOptions: FindManyOptions<UserEntity> = {
      relations: ['identities'],
    };

    const qb = userRepo.createQueryBuilder('user')
      .leftJoinAndSelect("user.identities", "identities")
      .where("identities.fk_user_id = user.id");

    {
      qb.where(`${qb.alias}.tenant = :tenant`, {
        tenant: ctx.tenant,
      });

      if (query.nickname) {
        qb.andWhere(`${qb.alias}.nickname LIKE :nickname`, {
          nickname: `%${query.nickname}%`,
        });
      }

      if (query.email) {
        qb.andWhere(`${qb.alias}.email = :email`, {
          email: query.email,
        });
      }

      if (query.phone_number) {
        qb.andWhere(`${qb.alias}.phone_number LIKE :phone_number`, {
          phone_number: `%${query.phone_number}%`,
        });
      }

      if (query.connection) {
        qb.andWhere(`${qb.alias}.connection = :connection`, {
          connection: query.connection,
        });
      }

      if (query.role_id) {
        qb.leftJoinAndSelect(
          'user_roles',
          'user_roles',
          `user_roles.tenant = ${qb.alias}.tenant AND user_roles.fk_user_id = ${qb.alias}.user_id`,
        ).andWhere('user_roles.fk_role_id =:role_id', {
          role_id: query.role_id,
        });
      }

      if (query.exclude_role_id) {
        const subQuery = qb
          .subQuery()
          .select('exclude_users.id')
          .from(UserEntity, 'exclude_users')
          .innerJoin(
            'user_roles',
            'user_roles',
            `user_roles.tenant = exclude_users.tenant AND user_roles.fk_user_id = exclude_users.user_id`,
          )
          .where(`user_roles.fk_role_id = :exclude_role_id`, {
            exclude_role_id: query.exclude_role_id,
          })
          .getQuery();

        qb.andWhere(`${qb.alias}.id NOT IN (${subQuery})`);
      }

      if (query.group) {
        let group_ids: string[];
        if (Array.isArray(query.group)) {
          group_ids = query.group;
        } else {
          group_ids = [query.group];
        }

        if (group_ids.length > 0) {
          qb.leftJoin(
            'user_groups',
            'user_groups',
            `user_groups.tenant = ${qb.alias}.tenant AND user_groups.user_id = ${qb.alias}.user_id`,
          ).andWhere('user_groups.group_id IN (:...group_ids)', {
            group_ids,
          });
        }
      }
      console.log('fuckquery.sort: ', query.sort);
      if (query.sort) {
        const order_by = {};
        const items = query.sort.split(' ');
        for (const item of items) {
          if (item.startsWith('-')) {
            order_by[item.substring(1)] = 'DESC';
          } else {
            order_by[item] = 'ASC';
          }
        }

        const _order_by = {};
        for (const k in order_by) {
          _order_by[`${qb.alias}.${k}`] = order_by[k];
        }
        qb.orderBy(_order_by);
      } else {
        qb.orderBy(`${qb.alias}.created_at`, 'DESC');
      }
    }

    const page = await paginate<UserEntity, PageMeta>(
      qb,
      options,
    );

    return {
      items: page.items.map(this.userMapper.toDTO),
      meta: page.meta,
    };
  }

  async findByIdentityProvider(
    ctx: IContext,
    provider: string,
    user_id: string,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);
    const user = await userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.identities', 'identities')
      .where(
        'user.tenant = :tenant AND identities.provider = :provider AND identities.user_id = :user_id',
        {
          tenant: ctx.tenant,
          provider,
          user_id,
        },
      )
      .getOne();

    return this.userMapper.toDTO(user);
  }

  async findByConnection(
    ctx: IContext,
    connection: string,
    user_id: string,
  ): Promise<UserModel | undefined> {
    const userRepo = await this.repo(ctx, UserEntity);
    const user = await userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.identities', 'identities')
      .where(
        'user.tenant = :tenant AND identities.connection = :connection AND identities.user_id = :user_id',
        {
          tenant: ctx.tenant,
          connection,
          user_id,
        },
      )
      .getOne();

    return this.userMapper.toDTO(user);
  }

  async updateFederatedIdentity(
    ctx: IContext,
    identity: Partial<IdentityModel>,
  ): Promise<{ affected?: number }> {
    return null;
  }

  async addFederatedIdentity(
    ctx: IContext,
    user_id: string,
    identity: IdentityModel,
  ): Promise<IdentityModel> {
    const identityRepo = await this.repo(ctx, IdentityEntity);

    const entity = await identityRepo.save({
      ...identity,
      fk_user_id: user_id,
      profile_data: identity.profile_data as any,
    });

    return entity;
  }

  async removeFederatedIdentity(
    ctx: IContext,
    connection: string,
    user_id: string,
  ): Promise<void> {
    const identityRepo = await this.repo(ctx, IdentityEntity);

    await identityRepo
      .createQueryBuilder('identity')
      .leftJoin('users', 'users')
      .delete()
      .where(
        'users.tenant = :tenant AND identity.connection = :connection AND user.user_id = :user_id',
        {
          tenant: ctx.tenant,
          connection,
          user_id,
        },
      )
      .execute();
  }

  async assignPermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissions,
  ): Promise<void> {
    const userRepo = await this.repo(ctx, UserEntity);
    const permissionRepo = await this.repo(ctx, PermissionEntity);

    const user: UserEntity = await userRepo.findOne({
      where: {
        tenant: ctx.tenant,
        user_id,
      },
      relations: ['permissions'],
    });
    if (!user)
      throw new NotFoundException(`User user_id: ${user_id} not found`);

    let permissions = await Promise.all(
      body.permissions?.map(async (it) => {
        return await permissionRepo
          .createQueryBuilder('permission')
          .leftJoin('permission.resource_server', 'resource_server')
          .where(
            'permission.name = :permission_name AND resource_server.tenant = :tenant AND resource_server.identifier = :identifier',
            {
              tenant: ctx.tenant,
              permission_name: it.permission_name,
              identifier: it.resource_server_identifier,
            },
          )
          .getOne();
      }),
    );
    permissions = permissions.filter((it) => !!it);
    console.log('add permissions: ', permissions);

    user.permissions = user.permissions || [];
    user.permissions.push(...permissions);
    console.log('user.permissions: ', user.permissions);

    await userRepo.save(user);
  }

  async removePermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissions,
  ): Promise<void> {
    const userRepo = await this.repo(ctx, UserEntity);
    const permissionRepo = await this.repo(ctx, PermissionEntity);

    const user: UserEntity = await userRepo.findOne({
      where: {
        tenant: ctx.tenant,
        user_id,
      },
      relations: ['permissions'],
    });
    if (!user)
      throw new NotFoundException(`User user_id: ${user_id} not found`);

    let permissions = await Promise.all(
      body.permissions?.map(async (it) => {
        return await permissionRepo
          .createQueryBuilder('permission')
          .leftJoin('permission.resource_server', 'resource_server')
          .where(
            'permission.name = :permission_name AND resource_server.tenant = :tenant AND resource_server.identifier = :identifier',
            {
              tenant: ctx.tenant,
              permission_name: it.permission_name,
              identifier: it.resource_server_identifier,
            },
          )
          .getOne();
      }),
    );
    permissions = permissions.filter((it) => !!it);
    console.log('delete permissions: ', permissions);

    await userRepo
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .relation(UserEntity, 'permissions')
      .of(user)
      .remove(permissions);
  }

  async paginatePermissions(
    ctx: IContext,
    user_id: string,
    query: PageQuery,
  ): Promise<Page<PermissionModel>> {
    const permissionRepo = await this.repo(ctx, PermissionEntity);
    const roleRepo = await this.repo(ctx, RoleEntity);

    const roles = await roleRepo
      .createQueryBuilder('roles')
      .select('roles.id')
      .leftJoin('user_roles', 'user_roles', 'user_roles.fk_role_id = roles.id')
      .where(
        'roles.tenant = :tenant AND user_roles.tenant = :tenant AND user_roles.fk_user_id = :user_id',
        {
          tenant: ctx.tenant,
          user_id,
        },
      )
      .getMany();

    const role_ids = roles.map((it) => it.id);
    console.log('userRoles: ', role_ids);

    const options: IPaginationOptions<PageMeta> = {
      limit: query.per_page,
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        per_page: meta.itemsPerPage,
      }),
    };

    const qb = permissionRepo.createQueryBuilder('permissions')

    {
      qb.leftJoin(`${qb.alias}.resource_server`, 'resource_server').addSelect(
        ['resource_server.identifier', 'resource_server.name'],
      );

      if (query.audience) {
        qb.where(`resource_server.identifier = :audience`, {
          audience: query.audience,
        });
      }

      qb.leftJoin(
        'user_permissions',
        'user_permissions',
        `user_permissions.permission_id = ${qb.alias}.id`,
      ).andWhere(
        'user_permissions.tenant = :tenant AND user_permissions.user_id = :user_id',
        {
          tenant: ctx.tenant,
          user_id,
        },
      );

      if (role_ids.length > 0) {
        qb.addSelect([
          'roles.id',
          'roles.name',
          'roles.description',
        ]).leftJoin(`${qb.alias}.roles`, 'roles');

        if (query.audience) {
          qb.orWhere(
            '(roles.id IN (:...role_ids) AND resource_server.identifier = :audience)',
            {
              role_ids,
              audience: query.audience,
            },
          );
        } else {
          qb.orWhere('roles.id IN (:...role_ids)', {
            role_ids,
          });
        }
      }
    }

    const page = await paginate(qb, options);

    const permission_ids = page.items.map((it) => it.id);
    const directPermissions = await permissionRepo
      .createQueryBuilder('permissions')
      .select('permissions.id')
      .leftJoin(
        'user_permissions',
        'user_permissions',
        'user_permissions.permission_id = permissions.id',
      )
      .where(
        'user_permissions.tenant = :tenant AND user_permissions.user_id = :user_id',
        {
          tenant: ctx.tenant,
          user_id,
        },
      )
      .andWhereInIds(permission_ids)
      .getMany();

    const directId2Permission = _.keyBy(directPermissions, 'id');

    return {
      items: page.items?.map((it) => {
        const sources: PermissionSourceModel[] = [];
        const direct = directId2Permission[it.id];
        if (direct) {
          sources.push({
            source_name: '',
            source_id: user_id,
            source_type: 'DIRECT',
          });
        }

        it.roles?.forEach((it) => {
          sources.push({
            source_type: 'ROLE',
            source_id: it.id,
            source_name: it.name,
          });
        });

        return {
          id: it.id,
          description: it.description,
          permission_name: it.name,
          resource_server_identifier: it.resource_server.identifier,
          resource_server_name: it.resource_server.name,
          sources,
        };
      }),
      meta: page.meta,
    };
  }

  async updateGroupsToUser(
    ctx: IContext,
    user_id: string,
    group_ids: string[],
    overwrite = false, // 是否覆盖
  ): Promise<void> {
    const userGroupRepo = await this.repo(ctx, UserGroupEntity);

    if (overwrite) {
      await userGroupRepo.delete;
      await userGroupRepo
        .createQueryBuilder()
        .delete()
        .from(UserGroupEntity)
        .where(
          `user_groups.tenant = :tenant AND user_groups.user_id = :user_id`,
          {
            tenant: ctx.tenant,
            user_id,
          },
        )
        .execute();
    }

    const groups = group_ids.map((id) =>
      userGroupRepo.create({
        user: {
          tenant: ctx.tenant,
          user_id,
        },
        group: {
          id,
        },
      }),
    );

    const r = await userGroupRepo.save(groups);
  }

  async linkIdentity(
    ctx: IContext,
    primaryUserId: string,
    linkIdentityReq: LinkIdentityReq,
  ): Promise<IdentityModel[]> {
    if (primaryUserId === linkIdentityReq.user_id)
      throw new APIException('invalid_request', '账户不能关联自身');

    const manager = await this.getManager(ctx);

    const savedUser = await manager.transaction(
      async (entityManager: EntityManager) => {
        const primaryUser = await entityManager.findOne(UserEntity, {
          where: {
            tenant: ctx.tenant,
            user_id: primaryUserId,
          },
        });
        if (!primaryUser)
          throw new APIException('invalid_request', '指定的主账号不存在');

        if (primaryUserId === linkIdentityReq.user_id)
          return this.userMapper.toDTO(primaryUser);

        const secondaryUser = await entityManager.findOne(UserEntity, {
          where: {
            tenant: ctx.tenant,
            user_id: linkIdentityReq.user_id,
          },
        });
        if (!secondaryUser)
          throw new APIException('invalid_request', '指定的从账号不存在');

        let index;
        if (linkIdentityReq.connection) {
          index = secondaryUser.identities.findIndex(
            (identity: IdentityEntity) =>
              identity.connection === linkIdentityReq.connection,
          );
        } else if (linkIdentityReq.provider) {
          index = secondaryUser.identities.findIndex(
            (identity: IdentityEntity) =>
              identity.provider === linkIdentityReq.provider,
          );
        } else {
          index = secondaryUser.identities.findIndex(
            (identity: IdentityEntity) =>
              identity.connection === secondaryUser.connection,
          );
        }

        if (index < 0) {
          // 严重错误, 违反完备性
          throw new InternalServerErrorException(
            `primary identity not found for ${secondaryUser.user_id}`,
          );
        }

        secondaryUser.identities.forEach((identity, i) => {
          identity.user = {
            tenant: primaryUser.tenant,
            user_id: primaryUser.user_id,
          } as UserEntity;

          // 主档案
          if (i === index) {
            const secondaryUserPrimaryIdentity = identity;
            secondaryUserPrimaryIdentity.profile_data = {
              ...secondaryUserPrimaryIdentity.profile_data,
              ...(secondaryUser.email && { email: secondaryUser.email }),
              ...(secondaryUser.email_verified && {
                email_verified: secondaryUser.email_verified,
              }),
              ...(secondaryUser.phone_number && {
                phone_number: secondaryUser.phone_number,
              }),
              ...(secondaryUser.phone_country_code && {
                phone_country_code: secondaryUser.phone_country_code,
              }),
              ...(secondaryUser.phone_number_verified && {
                phone_number_verified: secondaryUser.phone_number_verified,
              }),
              ...(secondaryUser.name && { name: secondaryUser.name }),
              ...(secondaryUser.nickname && {
                nickname: secondaryUser.nickname,
              }),
              ...(secondaryUser.username && {
                username: secondaryUser.username,
              }),
              ...(secondaryUser.given_name && {
                given_name: secondaryUser.given_name,
              }),
              ...(secondaryUser.picture && { picture: secondaryUser.picture }),
            };
          }

          primaryUser.identities.push(identity);
        });

        const savedUser = await entityManager.save(primaryUser);

        await entityManager.remove(secondaryUser);

        return this.userMapper.toDTO(savedUser);
      },
    );

    return savedUser.identities;
  }

  async unlinkIdentity(
    ctx: IContext,
    primaryUserId: string,
    connection: string,
    secondaryUserId: string,
  ): Promise<IdentityModel[]> {
    if (primaryUserId === secondaryUserId)
      throw new APIException('invalid_request', '账户不能解除关联自身');

    const manager = await this.getManager(ctx);

    const savedUser = await manager.transaction(
      async (entityManager: EntityManager) => {
        let primaryUser = await entityManager.findOneOrFail(UserEntity, {
          where: {
            tenant: ctx.tenant,
            user_id: primaryUserId,
          }
        });

        const identity = primaryUser.identities.find(
          (identity: IdentityEntity) =>
            identity.connection === connection &&
            identity.user_id === secondaryUserId,
        );
        if (!identity) {
          // 严重错误, 违反完备性
          throw new InternalServerErrorException(
            `identity not found for ${connection}:${secondaryUserId}`,
          );
        }

        const newUserId = `${identity.provider}|${secondaryUserId}`;

        identity.user = {
          tenant: ctx.tenant,
          user_id: newUserId,
        } as UserEntity;
        const profile_data = identity.profile_data || {};

        const newUser = this.userMapper.toEntity(ctx, {
          user_id: newUserId,
          connection: identity.connection,
          identities: [identity],
          ...(profile_data.email && { email: profile_data.email }),
          ...(profile_data.email_verified && {
            email_verified: profile_data.email_verified,
          }),
          ...(profile_data.phone_number && {
            phone_number: profile_data.phone_number,
          }),
          ...(profile_data.phone_country_code && {
            phone_country_code: profile_data.phone_country_code,
          }),
          ...(profile_data.phone_number_verified && {
            phone_number_verified: profile_data.phone_number_verified,
          }),
          ...(profile_data.name && { name: profile_data.name }),
          ...(profile_data.nickname && { nickname: profile_data.nickname }),
          ...(profile_data.username && { username: profile_data.username }),
          ...(profile_data.given_name && {
            given_name: profile_data.given_name,
          }),
          ...(profile_data.picture && { picture: profile_data.picture }),
        });
        await entityManager.save(newUser);

        primaryUser = await entityManager.findOneOrFail(UserEntity, {
          where: {
            tenant: ctx.tenant,
            user_id: primaryUserId,
          }
        });

        return this.userMapper.toDTO(primaryUser);
      },
    );

    return savedUser.identities;
  }

  @Inject()
  private readonly organizationMapper: OrganizationMapper;

  async listOrganizations(
    ctx: IContext,
    user_id: string,
    query: PageQuery,
  ): Promise<Page<OrganizationModel>> {
    const orgMemberRepo = await this.repo(ctx, OrganizationMemberEntity);

    const options = {
      limit: query.per_page,
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        per_page: meta.itemsPerPage,
      }),
    };

    /*
    const searchOptions: FindManyOptions<OrganizationMemberEntity> = {
      relations: ['organization'],
      where: {
        user: {
          tenant: ctx.tenant,
          user_id,
        }
      }
    };
    */

    const qb = await orgMemberRepo
      .createQueryBuilder('organization_members')
      .leftJoinAndSelect('organization_members.organization', 'organization', 'organization.id = organization_members.org_id')
      .leftJoinAndSelect('organization.branding', 'branding', 'branding.id = organization.fk_branding_id')
      .where('organization_members.tenant = :tenant AND organization_members.user_id = :user_id', { tenant: ctx.tenant, user_id })

    const page = await paginate(qb, options);

    return {
      meta: page.meta,
      items: page.items.map((it) =>
        this.organizationMapper.convertToDTO(it.organization),
      ),
    };
  }
}
