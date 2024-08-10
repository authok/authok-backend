import { PasswordHistoryModel } from './password-history.model';
import { IContext } from '@libs/nest-core';

export interface IPasswordHistoryRepository {
  create(
    ctx: IContext,
    userPasswordHistory: Partial<PasswordHistoryModel>,
  ): Promise<PasswordHistoryModel>;

  findByUser(
    ctx: IContext,
    userId: string,
  ): Promise<Partial<PasswordHistoryModel>[]>;
}
