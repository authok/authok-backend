import { IRequestContext } from '@libs/nest-core';
import { SecretQuestionDto } from './secret-question.dto';

export interface ISecretQuestionService {
  findAll(ctx: IRequestContext): Promise<Partial<SecretQuestionDto>[]>;
}
