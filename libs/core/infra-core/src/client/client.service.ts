import { Injectable, Inject, ConflictException } from '@nestjs/common';

import {
  ClientDto,
  CreateClientDto,
  UpdateClientDto,
} from 'libs/api/infra-api/src/client/client.dto';
import { IClientRepository } from 'libs/api/infra-api/src/client/client.repository';
import { IClientService } from 'libs/api/infra-api/src/client/client.service';
import { IContext } from '@libs/nest-core';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { ConnectionDto } from 'libs/api/infra-api/src/connection/connection.dto';
import { nanoid } from 'nanoid';
import { DEFAULT_GRANT_TYPES } from '@libs/oidc/common';

@Injectable()
export class ClientService implements IClientService {
  constructor(
    @Inject('IClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  retrieve(ctx: IContext, id: string): Promise<ClientDto | null> {
    return this.clientRepository.retrieve(ctx, id);
  }

  findByName(ctx: IContext, name: string): Promise<ClientDto | null> {
    return this.clientRepository.findByName(ctx, name);
  }

  async create(ctx: IContext, _client: CreateClientDto): Promise<ClientDto> {
    const existing = await this.clientRepository.findByName(ctx, _client.name);
    if (existing) {
      throw new ConflictException('client already exists');
    }

    const client = {
      ..._client,
      client_id: nanoid(32),
      client_secret: nanoid(64),
      id_token_signed_response_alg:
        _client.id_token_signed_response_alg || 'RS256',
      grant_types: _client.grant_types || DEFAULT_GRANT_TYPES,
      response_types: _client.response_types || [
        'code',
        'id_token token',
        'token',
      ],
      token_endpoint_auth_method: _client.token_endpoint_auth_method || 'none',
    } as ClientDto;

    return await this.clientRepository.create(ctx, client);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    this.clientRepository.delete(ctx, id);
  }

  async update(
    ctx: IContext,
    id: string,
    body: UpdateClientDto,
  ): Promise<ClientDto> {
    return await this.clientRepository.update(ctx, id, body);
  }

  async rotate(ctx: IContext, id: string): Promise<ClientDto> {
    const newSecret = nanoid(64);
    return await this.clientRepository.update(ctx, id, {
      client_secret: newSecret,
    });
  }

  async paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<ClientDto>> {
    return await this.clientRepository.paginate(ctx, query);
  }

  async findEnabledConnections(
    ctx: IContext,
    client_id: string,
  ): Promise<ConnectionDto[]> {
    return await this.clientRepository.findEnabledConnections(ctx, client_id);
  }
}
