import { Inject, Injectable } from '@nestjs/common';
import { IPasswordResetRepository } from 'libs/api/infra-api/src/password-reset/password-reset.repository';
import { PasswordResetDto } from 'libs/api/infra-api/src/password-reset/password-reset.dto';
import { IContext, ProxyQueryService } from '@libs/nest-core';
import { IPasswordResetService } from 'libs/api/infra-api/src/password-reset/password-reset.service';

@Injectable()
export class PasswordResetService extends ProxyQueryService<PasswordResetDto> implements IPasswordResetService {
  constructor(
    @Inject('IPasswordResetRepository')
    private readonly repo: IPasswordResetRepository,
  ) {
    super(repo);
  }

  async findByToken(
    ctx: IContext,
    token: string,
  ): Promise<PasswordResetDto> {
    return await this.repo.findByToken(ctx, token);
  }
}
