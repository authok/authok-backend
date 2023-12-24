import { ClientGrantDto } from 'libs/api/infra-api/src/client-grant/client-grant.dto';
import { ClientGrantEntity } from './client-grant.entity';
import { plainToClass } from 'class-transformer';
import { PermissionEntity } from '../permission/permission.entity';
import { ResourceServerEntity } from '../resource-server/resource-server.entity';

export class ClientGrantMapper {
  toDTO(entity?: ClientGrantEntity): ClientGrantDto | undefined {
    if (!entity) return undefined;

    const { resource_server, permissions, ...rest } = entity;

    const model = plainToClass(ClientGrantDto, rest);

    if (permissions) {
      model.scope = permissions.map((it) => it.name);
    }

    if (resource_server) {
      model.audience = resource_server.identifier;
    }

    return model;
  }

  toEntity(model?: Partial<ClientGrantDto>): ClientGrantEntity | undefined {
    if (!model) return undefined;

    const { scope, audience, ...rest } = model;

    const entity = plainToClass(ClientGrantEntity, rest);

    if (scope) {
      entity.permissions = scope.map((it) =>
        plainToClass(PermissionEntity, {
          name: it,
        }),
      );
    }

    if (audience) {
      entity.resource_server = plainToClass(ResourceServerEntity, {
        identifier: audience,
      });
    }

    return entity;
  }
}
