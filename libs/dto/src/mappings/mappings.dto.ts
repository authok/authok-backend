import { ApiProperty } from '@nestjs/swagger';

export class AttributeDto {
  @ApiProperty()
  readonly id?: string;

  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  readonly type?: string;
}

export class PropertyMapping {
  @ApiProperty({ description: 'expression' })
  readonly expression?: string;

  @ApiProperty({ description: 'pushStatus' })
  readonly pushStatus?: string;
}

export class MappingsDto {
  @ApiProperty()
  readonly id?: string;

  @ApiProperty({ description: 'properties' })
  readonly properties?: Record<string, PropertyMapping>;

  @ApiProperty({ description: 'source' })
  readonly source?: AttributeDto;

  @ApiProperty({ description: 'target' })
  readonly target?: AttributeDto;
}
