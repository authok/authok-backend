import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({})
export class DBConnectionDto {
  @JoiSchema(Joi.string())
  name: string;

  @JoiSchema(Joi.string())
  type: string;

  @JoiSchema(Joi.string())
  database: string;

  @JoiSchema(Joi.string())
  host: string;

  @JoiSchema(Joi.number())
  port: number;

  @JoiSchema(Joi.string())
  username: string;

  @JoiSchema(Joi.string())
  password: string;

  @JoiSchema(Joi.boolean())
  synchronize: boolean;

  @JoiSchema(Joi.string())
  timezone: string;

  @JoiSchema(Joi.boolean())
  logging: boolean;
}
