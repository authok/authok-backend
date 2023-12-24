import { IRequestContext } from '@libs/nest-core';
import { SecretQuestionDto } from './secret-question.dto';

export interface ISecretQuestionRepository {
  retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<SecretQuestionDto | undefined>;

  create(
    ctx: IRequestContext,
    secretQuestion: SecretQuestionDto,
  ): Promise<SecretQuestionDto>;

  batchCreate(
    ctx: IRequestContext,
    secretQuestions: Partial<SecretQuestionDto>[],
  ): Promise<Partial<SecretQuestionDto>[]>;

  getUserQuestions(
    ctx: IRequestContext,
    userId: string,
  ): Promise<Partial<SecretQuestionDto>[]>;

  findAll(ctx: IRequestContext): Promise<Partial<SecretQuestionDto>[]>;
}
