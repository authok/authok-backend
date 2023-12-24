import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ClientGrantDto,
} from 'libs/api/infra-api/src/client-grant/client-grant.dto';
import { IClientGrantRepository } from 'libs/api/infra-api/src/client-grant/client-grant.repository';
import { IClientGrantService } from 'libs/api/infra-api/src/client-grant/client-grant.service';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { IResourceServerRepository } from 'libs/api/infra-api/src/resource-server/resource-server.repository';
import { IClientRepository } from 'libs/api/infra-api/src/client/client.repository';
import { ClientGrantPageQuery } from 'libs/api/infra-api/src/client-grant/client-grant.model';
import { Page } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class ClientGrantService implements IClientGrantService {
  constructor(
    @Inject('IClientGrantRepository')
    private readonly clientGrantRepository: IClientGrantRepository,
    @Inject('IClientRepository')
    private readonly clientRepo: IClientRepository,
    @Inject('IResourceServerRepository')
    private readonly resourceServerRepo: IResourceServerRepository,
  ) {}

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<ClientGrantDto | undefined> {
    return await this.clientGrantRepository.retrieve(ctx, id);
  }

  async findByClientAndAudience(
    ctx: IRequestContext,
    client_id: string,
    audience: string,
  ): Promise<ClientGrantDto | undefined> {
    return await this.clientGrantRepository.findByClientAndAudience(
      ctx,
      client_id,
      audience,
    );
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: Partial<ClientGrantDto>,
  ): Promise<ClientGrantDto> {
    return await this.clientGrantRepository.update(ctx, id, data);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    return await this.clientGrantRepository.delete(ctx, id);
  }

  async create(
    ctx: IRequestContext,
    clientGrant: ClientGrantDto,
  ): Promise<ClientGrantDto> {
    const existingClientGrant = await this.clientGrantRepository.findByClientAndAudience(
      ctx,
      clientGrant.client_id,
      clientGrant.audience,
    );
    if (existingClientGrant) {
      throw new ConflictException('ClientGrant already exists');
    }

    const client = await this.clientRepo.retrieve(ctx, clientGrant.client_id);
    if (!client) throw new NotFoundException('client not found');

    const api = await this.resourceServerRepo.findByIdentifier(ctx, clientGrant.audience);
    if (!api) throw new NotFoundException(`resource server: ${clientGrant.audience} not found`);

    return await this.clientGrantRepository.create(ctx, clientGrant);
  }

  async paginate(
    @ReqCtx() ctx: IRequestContext,
    query: ClientGrantPageQuery,
  ): Promise<Page<ClientGrantDto>> {
    return await this.clientGrantRepository.paginate(ctx, query);
  }
}
