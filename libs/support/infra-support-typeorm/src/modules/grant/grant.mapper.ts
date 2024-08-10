import { GrantEntity } from './grant.entity';
import { GrantModel } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../user/user.entity';
import { ClientEntity } from '../client/client.entity';

export class GrantMapper {
  toEntity(ctx: IContext, model?: Partial<GrantModel>): GrantEntity {
    if (!model) return undefined;

    const { user_id, client_id, ...rest } = model;

    const entity = plainToClass(GrantEntity, rest || {});

    if (user_id) {
      entity.user = plainToClass(UserEntity, {
        tenant: ctx.tenant,
        user_id,
      });
    }

    if (client_id) {
      entity.client = plainToClass(ClientEntity, {
        client_id,
      });
    }

    return entity;
  }

  toDTO(entity?: GrantEntity): GrantModel {
    if (!entity) return undefined;

    const { user, client, ...rest } = entity;

    const model = plainToClass(GrantModel, rest || {});
    return model;
  }
}
