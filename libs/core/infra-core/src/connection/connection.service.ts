import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import { IConnectionService } from 'libs/api/infra-api/src/connection/connection.service';
import {
  ConnectionDto,
  UpdateConnectionDto,
  CreateConnectionDto,
} from 'libs/api/infra-api/src/connection/connection.dto';
import { IConnectionRepository } from 'libs/api/infra-api/src/connection/connection.repository';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { SOCIAL_STRATEGIES } from 'libs/core/authorization-core/src/utils/utils';

@Injectable()
export class ConnectionService implements IConnectionService {
  constructor(
    @Inject('IConnectionRepository')
    private connectionRepository: IConnectionRepository,
  ) {}

  findByName(
    ctx: IRequestContext,
    name: string,
  ): Promise<ConnectionDto | undefined> {
    return this.connectionRepository.findByName(ctx, name);
  }

  retrieve(ctx: IRequestContext, id: string): Promise<ConnectionDto | null> {
    return this.connectionRepository.retrieve(ctx, id);
  }

  async create(
    ctx: IRequestContext,
    input: CreateConnectionDto,
  ): Promise<ConnectionDto> {
    const connection = await this.connectionRepository.create(ctx, input);
    return {
      ...connection,
    };
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    this.connectionRepository.delete(ctx, id);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: UpdateConnectionDto,
  ): Promise<ConnectionDto> {
    await this.connectionRepository.update(ctx, id, data);

    return await this.connectionRepository.retrieve(ctx, id);
  }

  async paginate(
    @ReqCtx() ctx: IRequestContext,
    _query: PageQueryDto,
  ): Promise<PageDto<ConnectionDto>> {
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
