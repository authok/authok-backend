import { PasswordResetDto } from './password-reset.dto';
import { IContext, QueryService } from '@libs/nest-core';

export interface IPasswordResetService extends QueryService<PasswordResetDto> {
  findByToken(ctx: IContext, token: string): Promise<PasswordResetDto>;
}
