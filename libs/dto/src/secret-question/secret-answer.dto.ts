import { SecretQuestionDto } from './secret-question.dto';

export class SecretAnswerDto {
  user_id: string;

  secretQuestion: SecretQuestionDto;

  answer: string;
}
