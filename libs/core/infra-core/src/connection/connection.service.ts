import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import {
  IConnectionService,
  IConnectionRepository,
  ConnectionModel,
  UpdateConnectionModel,
  CreateConnectionModel,
} from 'libs/api/infra-api/src';
import { IContext, IRequestContext, ReqCtx } from '@libs/nest-core';
import { SOCIAL_STRATEGIES } from 'libs/core/authorization-core/src/utils/utils';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class ConnectionService implements IConnectionService {
  constructor(
    @Inject('IConnectionRepository')
    private connectionRepository: IConnectionRepository,
  ) {}

  findByName(
    ctx: IContext,
    name: string,
  ): Promise<ConnectionModel | undefined> {
    return this.connectionRepository.findByName(ctx, name);
  }

  retrieve(ctx: IContext, id: string): Promise<ConnectionModel | null> {
    return this.connectionRepository.retrieve(ctx, id);
  }

  async create(
    ctx: IContext,
    input: CreateConnectionModel,
  ): Promise<ConnectionModel> {
    const connection = await this.connectionRepository.create(ctx, input);
    return {
      ...connection,
    };
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    this.connectionRepository.delete(ctx, id);
  }

  async update(
    ctx: IContext,
    id: string,
    data: UpdateConnectionModel,
  ): Promise<ConnectionModel> {
    await this.connectionRepository.update(ctx, id, data);

    return await this.connectionRepository.retrieve(ctx, id);
  }

  async paginate(
    @ReqCtx() ctx: IRequestContext,
    _query: PageQuery,
  ): Promise<Page<ConnectionModel>> {
    const { strategy_type, ...rest} = _query;

    const query = { ...rest };
    if (strategy_type === 'social') {
      query.strategy = SOCIAL_STRATEGIES;
    } else if (strategy_type === 'passwordless') {
      query.strategy = ['sms', 'email'];
    } else if (strategy_type === 'enterprise') {
      query.strategy = ['samlp', 'oidc', 'google-apps', 'waad', 'adfs', 'ad', 'pingfederate'];
    }

    return await this.connectionRepository.paginate(ctx, query);
  }
}
