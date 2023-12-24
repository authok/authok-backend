import { UserDto } from 'libs/api/infra-api/src/user/user.dto';
import { UserEntity } from './user.entity';
import { plainToClass } from 'class-transformer';
import { IdentityEntity } from '../identity/identity.entity';
import { IdentityDto } from 'libs/api/infra-api/src/identity/identity.dto';
import { UserRoleEntity } from '../role/role.entity';
import { RoleDto } from 'libs/api/infra-api/src/role/role.dto';
import { IRequestContext } from '@libs/nest-core';
import * as _ from 'lodash';

export class UserMapper {
  toEntity(
    ctx: IRequestContext,
    model?: Partial<UserDto>,
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

    if (roles) {
      entity.roles = roles.map((role) =>
        plainToClass(UserRoleEntity, {
          role: {
            id: role.id,
          },
        }),
      );
    }

    return entity;
  }

  toDTO(entity?: UserEntity): UserDto | undefined {
    if (!entity) return undefined;

    const { roles, identities, ...rest } = entity;

    const model = plainToClass(UserDto, rest, { exposeUnsetFields: false });

    if (identities) {
      model.identities = identities?.map(
        // 能过滤 undefined, 不能过滤 null
        (it) =>
          plainToClass(IdentityDto, _.omit(it, 'tenant', 'fk_user_id'), {
            exposeUnsetFields: false,
          }),
      );
    }

    if (roles) {
      model.roles = roles.map((it) =>
        plainToClass(
          RoleDto,
          {
            id: it.role.id,
            name: it.role.name,
            description: it.role.description,
          },
          { exposeUnsetFields: false },
        ),
      );
    }

    return model;
  }
}
