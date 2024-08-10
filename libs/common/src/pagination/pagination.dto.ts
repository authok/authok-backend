import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiPropertyOptional } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PageQueryDto {
  @ApiProperty({ description: 'Query', required: false })
  @JoiSchema(Joi.string().allow(''))
  readonly q?: string;

  // @ApiProperty({ description: '过滤条件', required: false })
  // filter?: any;

  @ApiProperty({ default: 1, required: false, description: '页码' })
  @JoiSchema(Joi.number().default(1).min(1))
  readonly page?: number;

  @ApiProperty({
    default: 10,
    required: false,
    description: 'The number displayed per page should not exceed 100.',
  })
  @JoiSchema(Joi.number().default(10))
  readonly per_page?: number;

  @ApiProperty({
    description: 'Field to sort by. Use field:order where order is 1 for ascending and -1 for descending. e.g. created_at:1',
    required: false,
    title: 'Sort',
  })
  @JoiSchema(Joi.string())
  readonly sort?: string;

  @ApiProperty({
    default: false,
    required: false,
    description: 'Return results inside an object that contains the total result count (true) or as a direct array of results (false, default).',
  })
  @JoiSchema(Joi.boolean().default(false))
  readonly include_totals?: boolean;

  @ApiProperty({
    default: false,
    required: false,
    description: 'Whether specified fields are to be included (true) or excluded (false).',
  })
  @JoiSchema(Joi.boolean().default(false))
  readonly include_fields?: boolean;

  @ApiProperty({ required: false, description: 'Comma-separated list of fields to include or exclude (based on value provided for include_fields) in the result. Leave empty to retrieve all fields.' })
  @JoiSchema(Joi.string())
  fields?: string;

  [key: string]: any;
}

export class PageMetaDto {
  @ApiProperty({ description: 'Page index of the results to return. First page is 0.' })
  readonly page: number;

  @ApiProperty({ description: 'Number of results per page.' })
  readonly per_page: number;

  @ApiProperty({ description: 'Total results' })
  readonly total?: number | undefined;

  [key: string]: any;
}

export class PageDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty({ type: PageMetaDto })
  meta: PageMetaDto;
}

export class StartLimitPageDto {
  @ApiPropertyOptional()
  start: number;

  @ApiPropertyOptional()
  limit: number;

  @ApiPropertyOptional()
  total: number;
}

export const pageDtoFactory = <T extends Function>(
  type: T,
): new () => PageDto<T> => {
  class paginatedDto<T> extends PageDto<T> {
    @ApiProperty({ type: PageMetaDto })
    declare meta: PageMetaDto;

    @ApiProperty({ type: [type] })
    declare items: T[];
  }

  return paginatedDto;
};
