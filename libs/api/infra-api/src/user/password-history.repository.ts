import { PasswordHistoryDto } from './password-history.dto';
import { IRequestContext } from '@libs/nest-core';

export interface IPasswordHistoryRepository {
  // retrieve(id: string): Promise<PasswordHistoryDto | undefined>;

  create(
    ctx: IRequestContext,
    userPasswordHistory: Partial<PasswordHistoryDto>,
  ): Promise<PasswordHistoryDto>;

  findByUser(
    ctx: IRequestContext,
    userId: string,
  ): Promise<Partial<PasswordHistoryDto>[]>;
}
