import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ClientGrantModel,
  ClientGrantPageQuery,
  IClientGrantRepository,
  IClientGrantService,
  IResourceServerRepository,
  IClientRepository,
} from 'libs/api/infra-api/src';
import { IContext, ReqCtx } from '@libs/nest-core';
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
    ctx: IContext,
    id: string,
  ): Promise<ClientGrantModel | undefined> {
    return await this.clientGrantRepository.retrieve(ctx, id);
  }

  async findByClientAndAudience(
    ctx: IContext,
    client_id: string,
    audience: string,
  ): Promise<ClientGrantModel | undefined> {
    return await this.clientGrantRepository.findByClientAndAudience(
      ctx,
      client_id,
      audience,
    );
  }

  async update(
    ctx: IContext,
    id: string,
    data: Partial<ClientGrantModel>,
  ): Promise<ClientGrantModel> {
    return await this.clientGrantRepository.update(ctx, id, data);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    return await this.clientGrantRepository.delete(ctx, id);
  }

  async create(
    ctx: IContext,
    clientGrant: ClientGrantModel,
  ): Promise<ClientGrantModel> {
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
    @ReqCtx() ctx: IContext,
    query: ClientGrantPageQuery,
  ): Promise<Page<ClientGrantModel>> {
    return await this.clientGrantRepository.paginate(ctx, query);
  }
}
