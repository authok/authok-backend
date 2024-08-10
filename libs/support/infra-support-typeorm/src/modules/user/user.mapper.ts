import { UserEntity } from './user.entity';
import { plainToClass } from 'class-transformer';
import { IdentityEntity } from '../identity/identity.entity';
import { UserRoleEntity } from '../role/role.entity';
import { IContext } from '@libs/nest-core';
import * as _ from 'lodash';
import { UserModel, IdentityModel } from 'libs/api/infra-api/src';

export class UserMapper {
  toEntity(
    ctx: IContext,
    model?: Partial<UserModel>,
  ): UserEntity | undefined {
    if (!model) return undefined;

    const { roles, identities, ...rest } = model;

    const entity = plainToClass(UserEntity, rest);
    entity.tenant = ctx.tenant;

    if (identities) {
      entity.identities = identities.map((identity) =>
        plainToClass(IdentityEntity, {
          id: identity.id,
          connection: identity.connection,
          user_id: identity.user_id,
          provider: identity.provider,
          is_social: identity.is_social,
          access_token: identity.access_token,
          expires_in: identity.expires_in,
          refresh_token: identity.refresh_token,
          profile_data: identity.profile_data,
        }),
      );
    }

    // TODO 要单独建立一个 create user. 或者直接忽略 role 子对象
    if (roles) {
      entity.roles = roles.map((role) =>
        plainToClass(UserRoleEntity, {
          role: {
            id: role.role.id,
          },
        }),
      );
    }

    return entity;
  }

  toDTO(entity?: UserEntity): UserModel | undefined {
    if (!entity) return undefined;

    const { roles, identities, ...rest } = entity;

    const model = plainToClass(UserModel, rest, { exposeUnsetFields: false });

    if (identities) {
      model.identities = identities?.map(
        // 能过滤 undefined, 不能过滤 null
        (it) =>
          plainToClass(IdentityModel, _.omit(it, 'tenant', 'fk_user_id'), {
            exposeUnsetFields: false,
          }),
      );
    }

    model.roles = roles;

    return model;
  }
}
