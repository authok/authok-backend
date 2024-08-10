import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ClientModel } from 'libs/api/infra-api/src';
import { ClientEntity } from './client.entity';
import { ClientGrantMapper } from '../client-grant/client-grant.mapper';

@Injectable()
export class ClientMapper {
  constructor(private readonly clientGrantMapper: ClientGrantMapper) {}

  toDTO(entity?: ClientEntity): ClientModel | undefined {
    if (!entity) return undefined;

    const { grants: _grants, ...rest } = entity;
    const grants = _grants?.map((grant) => this.clientGrantMapper.toDTO(grant));

    const dto = { grants, ...rest };
    return dto;
  }

  toEntity(dto?: Partial<ClientModel>): ClientEntity | undefined {
    if (!dto) return undefined;

    const { grants, ...rest } = dto;
    const entity = plainToClass(ClientEntity, rest);
    return entity;
  }
}
