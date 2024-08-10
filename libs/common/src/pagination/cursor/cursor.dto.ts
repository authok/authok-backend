import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';

export type Order = 'ASC' | 'DESC';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CursorQueryDto {
  @JoiSchema(Joi.number())
  first?: number;

  @JoiSchema(Joi.string())
  after?: string;

  @JoiSchema(Joi.number())
  last?: number;

  @JoiSchema(Joi.string())
  before?: string;

  @JoiSchema(Joi.string())
  order?: Order;

  @JoiSchema(Joi.string())
  sorter?: string;

  [key: string]: any;
}

interface Edge<T> {
  cursor: string;
  node: T;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CursorResult<T> {
  total?: number;
  data: Edge<T>[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}