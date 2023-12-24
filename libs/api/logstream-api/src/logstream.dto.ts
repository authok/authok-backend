import { ApiProperty } from '@nestjs/swagger';

export class LogStreamDto {
  id: string;
  name: string;
  type: string;

  @ApiProperty({
    example: {
      httpEndpoint: '',
      httpContentType: '',
      httpContentFormat: '',
      httpAuthorization: '',
      httpCustomHeaders: [''],
    },
  })
  sink: Record<string, any>;
}

export class CreateLogStreamDto {
  name: string;
  type: string;
  sink: Record<string, any>;
}

export class UpdateLogStreamDto {
  name: string;
  status: string;
  sink: Record<string, any>;
}
