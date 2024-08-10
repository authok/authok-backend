import { PasswordResetModel } from './password-reset.model';
import { QueryRepository, IContext } from '@libs/nest-core';

export interface IPasswordResetRepository extends QueryRepository<PasswordResetModel> {
  findByToken(
    ctx: IContext,
    token: string,
  ): Promise<PasswordResetModel | undefined>;
}