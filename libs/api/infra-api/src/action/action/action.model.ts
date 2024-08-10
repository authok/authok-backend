import { PartialType, PickType } from "@nestjs/swagger";
import { TriggerModel } from "../trigger/trigger.model";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

export class IntegrationModel {
  id: string;
  catalogId: string;
  urlSlug: string;
  partnerId: string;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  featureType: string;
  termsOfUseUrl: string;
  privacyPolicyUrl: string;
  publicSupportLink: string;
  currentRelease: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ActionVersionModel {
  id: string;
  code: string;
  dependencies: DependencyModel[];
  deployed: boolean;
  runtime: string;
  secrets: SecretModel[];
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class ActionModel {
  id: string;
  code: string;
  dependencies: DependencyModel[];
  name: string;
  supported_triggers: TriggerModel[];  
  runtime: string;
  secrets: SecretModel[];
  deployed_version: ActionVersionModel;
  installed_integration_id: string;
  integration: IntegrationModel;
  status: string;
  all_changes_deployed: boolean;
  built_at: Date;
  created_at: Date;
  updated_at: Date;
}

export class CreateActionModel extends PickType(ActionModel, [
  'name',
  'code',
  'dependencies',
  'runtime',
  'secrets',
]) {
  supported_triggers: string[];
}

export class UpdateActionModel extends PartialType(CreateActionModel) {}

export class DependencyModel {
  name: string;
  version: string;
}

export class SecretModel {
  name: string;
  value: string;
  updated_at: string;
}

export interface ActionPageQuery extends PageQuery {
  trigger: string | string[];
  deployed: boolean;
  installed: boolean;
}

export class ExecutionModel {
  id: string;

  triggerId: string;

  status: string;

  results: any[];

  createdAt: Date;

  updatedAt: Date;
}

export class TestActionBody {
  readonly payload: any;
}

export class TestActionRes {
  readonly payload: any;
}

export class DeployDraftVersionBody {
  updateDraft: boolean;
}