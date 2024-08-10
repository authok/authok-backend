import { plainToClass } from 'class-transformer';
import { ConnectionEntity } from './connection.entity';
import { ConnectionModel } from 'libs/api/infra-api/src';

export class ConnectionMapper {
  toDTO(entity?: ConnectionEntity): ConnectionModel | undefined {
    if (!entity) return undefined;

    const { enabled_clients, ...rest } = entity;
    const model = plainToClass(ConnectionModel, rest);

    if (enabled_clients) {
      model.enabled_clients = enabled_clients.map((it) => it.client_id);
    }

    model.options = model.options || {};

    return model;
  }
}
