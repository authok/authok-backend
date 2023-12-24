import { JoiSchemaOptions, CREATE, JoiSchema } from "nestjs-joi";
import { ActionDto } from "../action/action.dto";
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TriggerBindingDto {
  id: string;

  trigger_id: string;

  display_name: string;

  action: ActionDto;

  created_at: Date;

  updated_at: Date;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class BindingActionReferenceDto {
  @JoiSchema([CREATE], Joi.string())
  type: string;

  @JoiSchema([CREATE], Joi.string())
  value: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateTriggerBindingDto {
  @JoiSchema(Joi.object())
  ref: BindingActionReferenceDto;

  @JoiSchema(Joi.string())
  display_name: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TriggerBindingsUpdateRequest {
  @JoiSchema(Joi.array().items(Joi.object()))
  bindings: UpdateTriggerBindingDto[];
}