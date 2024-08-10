import { IContext } from '@libs/nest-core';
import { SecretQuestionModel } from './secret-question.model';

export interface ISecretQuestionRepository {
  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<SecretQuestionModel | undefined>;

  create(
    ctx: IContext,
    secretQuestion: SecretQuestionModel,
  ): Promise<SecretQuestionModel>;

  batchCreate(
    ctx: IContext,
    secretQuestions: Partial<SecretQuestionModel>[],
  ): Promise<Partial<SecretQuestionModel>[]>;

  getUserQuestions(
    ctx: IContext,
    userId: string,
  ): Promise<Partial<SecretQuestionModel>[]>;

  findAll(ctx: IContext): Promise<Partial<SecretQuestionModel>[]>;
}
