import { ActionModel } from "../action/action.model";

export class TriggerBindingModel {
  id: string;
  trigger_id: string;
  display_name: string;
  action: ActionModel;
  created_at: Date;
  updated_at: Date;
}

export class BindingActionReferenceModel {
  type: string;
  value: string;
}

export class UpdateTriggerBindingModel {
  ref: BindingActionReferenceModel;
  display_name: string;
}

export class TriggerBindingsUpdateRequest {
  bindings: UpdateTriggerBindingModel[];
}