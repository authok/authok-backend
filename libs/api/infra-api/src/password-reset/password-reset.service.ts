import { PasswordResetModel } from './password-reset.model';
import { IContext, QueryService } from '@libs/nest-core';

export interface IPasswordResetService extends QueryService<PasswordResetModel> {
  findByToken(ctx: IContext, token: string): Promise<PasswordResetModel>;
}
