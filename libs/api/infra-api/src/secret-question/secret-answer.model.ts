import { SecretQuestionModel } from './secret-question.model';

export class SecretAnswerModel {
  user_id: string;
  secretQuestion: SecretQuestionModel;
  answer: string;
}
