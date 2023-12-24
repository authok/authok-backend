import { PasswordResetDto } from './password-reset.dto';
import { QueryRepository, IContext } from '@libs/nest-core';

export interface IPasswordResetRepository extends QueryRepository<PasswordResetDto> {
  findByToken(
    ctx: IContext,
    token: string,
  ): Promise<PasswordResetDto | undefined>;
}