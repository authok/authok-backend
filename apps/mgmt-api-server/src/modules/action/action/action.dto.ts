import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';
import { TriggerEvent } from '@authok/action-core-module';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TriggerEventDto extends TriggerEvent {}