import { ConnectionDto } from 'libs/api/infra-api/src/connection/connection.dto';
import { plainToClass } from 'class-transformer';
import { ConnectionEntity } from './connection.entity';

export class ConnectionMapper {
  toDTO(entity?: ConnectionEntity): ConnectionDto | undefined {
    if (!entity) return undefined;

    const { enabled_clients, ...rest } = entity;
    const model = plainToClass(ConnectionDto, rest);

    if (enabled_clients) {
      model.enabled_clients = enabled_clients.map((it) => it.client_id);
    }

    model.options = model.options || {};

    return model;
  }
}
