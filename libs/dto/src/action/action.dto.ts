import { JoiSchemaOptions, JoiSchema, CREATE, UPDATE } from "nestjs-joi";
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import * as Joi from 'joi';
import { ApiProperty, PickType, PartialType } from "@nestjs/swagger";
import { TriggerDto } from "./trigger.dto";

export class IntegrationDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({ name: 'catalog_id' })
  readonly catalogId: string;

  @ApiProperty({ name: 'url_slug' })
  readonly urlSlug: string;

  @ApiProperty({ name: 'partner_id' })
  readonly partnerId: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({ name: 'short_description' })
  readonly shortDescription: string;

  @ApiProperty()
  readonly logo: string;

  @ApiProperty({ name: 'feature_type' })
  readonly featureType: string;

  @ApiProperty({ name: 'terms_of_use_url' })
  readonly termsOfUseUrl: string;

  @ApiProperty({ name: 'privacy_policy_url' })
  readonly privacyPolicyUrl: string;

  @ApiProperty({ name: 'public_support_link' })
  readonly publicSupportLink: string;

  @ApiProperty({ name: 'current_release' })
  readonly currentRelease: string;

  @ApiProperty({ name: 'created_at' })
  readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  readonly updatedAt: Date;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ActionVersionDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: '动作的源代码.',
  })
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  code: string;

  @ApiProperty({
    description:
      '依赖的第三方 npm 模块和版本.',
  })
  @JoiSchema(Joi.object())
  dependencies: DependencyDto[];

  @JoiSchema(Joi.boolean())
  deployed: boolean;

  @ApiProperty({
    description: 'Node 运行时. 例如: node16, 默认是 node16',
  })
  @JoiSchema(Joi.string())
  runtime: string;

  @ApiProperty({
    description:
      'The list of secrets that are included in an action or a version of an action.',
  })
  @JoiSchema(Joi.object())
  secrets: SecretDto[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}


@JoiSchemaOptions({
  allowUnknown: false,
})
export class ActionDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: '动作的源代码.',
  })
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  code: string;

  @ApiProperty({
    description:
      '依赖的第三方 npm 模块和版本.',
  })
  @JoiSchema(Joi.object())
  dependencies: DependencyDto[];

  @ApiProperty({ description: 'action的名称.' })
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  name: string;

  @ApiProperty({
    description:
      'The list of triggers that this action supports. At this time, an action can only target a single trigger at a time.',
  })
  @JoiSchema(Joi.string())
  supported_triggers: TriggerDto[];  

  @ApiProperty({
    description: 'Node 运行时. 例如: node16, 默认是 node16',
  })
  @JoiSchema(Joi.string())
  runtime: string;

  @ApiProperty({
    description:
      'The list of secrets that are included in an action or a version of an action.',
  })
  @JoiSchema(Joi.object())
  secrets: SecretDto[];

  @ApiProperty()
  deployed_version: ActionVersionDto;

  @ApiProperty()
  installed_integration_id: string;

  @ApiProperty({
    description:
      'Integration defines a self contained functioning unit which partners publish. A partner may create one or many of these integrations.',
  })
  integration: IntegrationDto;

  @ApiProperty()
  status: string;

  @ApiProperty()
  all_changes_deployed: boolean;

  @ApiProperty()
  built_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class CreateActionDto extends PickType(ActionDto, [
  'name',
  'code',
  'dependencies',
  'runtime',
  'secrets',
]) {
  @JoiSchema(Joi.array().items(Joi.string()))
  supported_triggers: string[];
}

export class UpdateActionDto extends PartialType(CreateActionDto) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class DependencyDto {
  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  readonly name: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  readonly version: string;
}

export class SecretDto {
  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  name: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  value: string;

  @ApiProperty()
  updated_at: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ActionPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  trigger: string | string[];

  @JoiSchema(Joi.boolean())
  deployed: boolean;

  @JoiSchema(Joi.boolean())
  installed: boolean;
}

export class ExecutionDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({ name: 'trigger_id' })
  readonly triggerId: string;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly results: any[];

  @ApiProperty({ name: 'created_at' })
  readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  readonly updatedAt: Date;
}

export class TestActionBody {
  @ApiProperty()
  readonly payload: any;
}

export class TestActionRes {
  @ApiProperty()
  readonly payload: any;
}

export class DeployDraftVersionBody {
  @ApiProperty({
    name: 'update_draft',
    description:
      'True if the draft of the action should be updated with the reverted version.',
  })
  readonly updateDraft: boolean;
}
