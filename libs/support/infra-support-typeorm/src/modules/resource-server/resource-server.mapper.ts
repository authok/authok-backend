import { ResourceServerEntity } from './resource-server.entity';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PermissionEntity } from '../permission/permission.entity';
import { ResourceServerModel } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';

@Injectable()
export class ResourceServerMapper {
  toEntity(
    ctx: IContext,
    model?: Partial<ResourceServerModel>,
  ): ResourceServerEntity | undefined {
    if (!model) return undefined;

    const { scopes, ..._rest } = model;
    const entity = plainToClass(ResourceServerEntity, _rest);
    entity.tenant = ctx.tenant;

    if (scopes) {
      entity.permissions = scopes.map((it) =>
        plainToClass(PermissionEntity, {
          name: it.value,
          description: it.description,
        }),
      );
    }

    return entity;
  }

  toDTO(entity?: ResourceServerEntity): ResourceServerModel | undefined {
    if (!entity) return undefined;

    const { permissions, ..._rest } = entity;

    const model = plainToClass(ResourceServerModel, { ..._rest });
    if (permissions) {
      model.scopes = permissions?.map((it) => ({
        value: it.name,
        description: it.description,
      }));
    }

    return model;
  }
}
