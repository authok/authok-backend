import { IContext } from '@libs/nest-core';
import { SecretQuestionModel } from './secret-question.model';

export interface ISecretQuestionService {
  findAll(ctx: IContext): Promise<Partial<SecretQuestionModel>[]>;
}
