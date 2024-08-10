import { Inject, Injectable } from '@nestjs/common';
import { IContext, ProxyQueryService } from '@libs/nest-core';
import { 
  IPasswordResetRepository,
  IPasswordResetService, 
  PasswordResetModel,
} from 'libs/api/infra-api/src';

@Injectable()
export class PasswordResetService extends ProxyQueryService<PasswordResetModel> implements IPasswordResetService {
  constructor(
    @Inject('IPasswordResetRepository')
    private readonly repo: IPasswordResetRepository,
  ) {
    super(repo);
  }

  async findByToken(
    ctx: IContext,
    token: string,
  ): Promise<PasswordResetModel> {
    return await this.repo.findByToken(ctx, token);
  }
}
