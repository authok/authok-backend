import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PageQueryDto {
  @ApiProperty({ description: '查询条件', required: false })
  @JoiSchema(Joi.string().allow(''))
  readonly q?: string;

  @ApiProperty({ description: '过滤条件', required: false })
  filter?: any;

  @ApiProperty({ default: 1, required: false, description: '页码' })
  @JoiSchema(Joi.number().default(1).min(1))
  readonly page?: number;

  @ApiProperty({
    default: 10,
    required: false,
    description: '每页显示数量, 不得超过100',
  })
  @JoiSchema(Joi.number().default(10))
  readonly page_size?: number;

  @ApiProperty({
    description:
      '排序, -代表降序(DESC), 默认为升序(ASC), 用":"分割多个排序字段, 例如: -created_at:name',
    required: false,
    title: '排序',
  })
  @JoiSchema(Joi.string())
  readonly sort?: string;

  @ApiProperty({
    default: false,
    required: false,
    description: '是否包含记录总数',
  })
  @JoiSchema(Joi.boolean().default(false))
  readonly include_totals?: boolean;

  @ApiProperty({
    default: false,
    required: false,
    description:
      '设置为true, 返回的记录只包含fields对应的字段，设置为false, 返回的记录不包含fields对应的字段',
  })
  @JoiSchema(Joi.boolean().default(false))
  readonly include_fields?: boolean;

  @ApiProperty({ required: false, description: '指定获取的字段集，用","分割' })
  @JoiSchema(Joi.string())
  fields?: string;

  [key: string]: any;
}

export class PageMeta {
  @ApiProperty({ description: '当前页' })
  readonly page: number;

  @ApiProperty({ description: '每页记录条数' })
  readonly page_size: number;

  @ApiProperty({ description: '总记录数' })
  readonly total?: number | undefined;

  [key: string]: any;
}

export class PageDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty({ type: PageMeta })
  meta: PageMeta;
}

export const pageDtoFactory = <T extends Function>(
  type: T,
): new () => PageDto<T> => {
  class paginatedDto<T> extends PageDto<T> {
    @ApiProperty({ type: PageMeta })
    declare meta: PageMeta;

    @ApiProperty({ type: [type] })
    declare items: T[];
  }

  return paginatedDto;
};
