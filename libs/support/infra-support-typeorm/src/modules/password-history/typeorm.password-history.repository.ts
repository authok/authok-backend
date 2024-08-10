import { PasswordHistoryEntity } from './password-history.entity';
import { Injectable } from '@nestjs/common';
import { IPasswordHistoryRepository } from 'libs/api/infra-api/src';
import { PasswordHistoryModel } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';

@Injectable()
export class TypeOrmPasswordHistoryRepository
  extends TenantAwareRepository
  implements IPasswordHistoryRepository {

  async create(
    ctx: IContext,
    _passwordHistory: Partial<PasswordHistoryModel>,
  ): Promise<PasswordHistoryModel> {
    const repo = await this.repo(ctx, PasswordHistoryEntity);
    const passwordHistory = repo.create({
      user: {
        tenant: ctx.tenant,
        user_id: _passwordHistory.user_id,
      },
      used_password: _passwordHistory.used_password,
    });

    const saved = await repo.save(passwordHistory);
    
    return {
      id: saved.id,
      user_id: _passwordHistory.user_id!,
      used_password: _passwordHistory.used_password!,
    };
  }

  async findByUser(
    ctx: IContext,
    user_id: string,
  ): Promise<Partial<PasswordHistoryModel>[]> {
    const repo = await this.repo(ctx, PasswordHistoryEntity);
    const passwordHistories = await repo.find({
      where: {
        user: {
          tenant: ctx.tenant,
          user_id: user_id,
        },
      },
    });

    return passwordHistories.map((it) => ({
      id: it.id,
      user_id,
      used_password: it.used_password,
    }));
  }
}
