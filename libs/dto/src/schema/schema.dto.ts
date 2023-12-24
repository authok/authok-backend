import { ApiProperty } from '@nestjs/swagger';

export class SchemaDto {
  @ApiProperty()
  readonly id?: string;

  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  readonly description?: string;

  @ApiProperty()
  readonly title?: string;

  @ApiProperty()
  readonly type?: string;

  @ApiProperty()
  readonly definitions: any;

  @ApiProperty()
  readonly properties: any;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
