import { IRequestContext } from '@libs/nest-core';
import { SecretAnswerDto } from './secret-answer.dto';

export interface ISecretAnswerRepository {
  retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<SecretAnswerDto | undefined>;

  create(
    ctx: IRequestContext,
    secretAnswer: Partial<SecretAnswerDto>,
  ): Promise<SecretAnswerDto>;

  batchCreate(
    ctx: IRequestContext,
    secretAnswers: Partial<SecretAnswerDto>[],
  ): Promise<SecretAnswerDto[]>;

  findByUser(
    ctx: IRequestContext,
    user_id: string,
  ): Promise<Partial<SecretAnswerDto>[]>;
}
