import { ApiProperty } from '@nestjs/swagger';

export class SecretQuestionDto {
  @ApiProperty()
  id: string;

  @ApiProperty({})
  text: string;
}
