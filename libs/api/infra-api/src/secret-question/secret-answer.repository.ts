import { IContext } from '@libs/nest-core';
import { SecretAnswerModel } from './secret-answer.model';

export interface ISecretAnswerRepository {
  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<SecretAnswerModel | undefined>;

  create(
    ctx: IContext,
    secretAnswer: Partial<SecretAnswerModel>,
  ): Promise<SecretAnswerModel>;

  batchCreate(
    ctx: IContext,
    secretAnswers: Partial<SecretAnswerModel>[],
  ): Promise<SecretAnswerModel[]>;

  findByUser(
    ctx: IContext,
    user_id: string,
  ): Promise<Partial<SecretAnswerModel>[]>;
}
