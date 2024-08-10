import { ActionEntity } from './action.entity';
import { ActionModel } from 'libs/api/infra-api/src';
import { plainToClass } from 'class-transformer';
import { TriggerEntity } from '../trigger/trigger.entity';
import { IContext } from '@libs/nest-core';

export class ActionMapper {
  toDTO(entity?: Partial<ActionEntity>): ActionModel | undefined {
    if (!entity) return undefined;

    const { supported_triggers, dependencies, secrets, ...rest } = entity;

    const model = plainToClass(ActionModel, rest);
    if (supported_triggers) {
      model.supported_triggers = supported_triggers;
    }

    if (dependencies) {
      model.dependencies = dependencies;
    }

    if (secrets) {
      model.secrets = secrets;
    }

    return model;
  }

  toEntity(
    ctx: IContext,
    model?: Partial<ActionModel>,
  ): ActionEntity | undefined {
    if (!model) return undefined;

    const { supported_triggers, dependencies, secrets, ...rest } = model;

    const entity = plainToClass(ActionEntity, { ...rest });
    entity.tenant = ctx.tenant;

    if (supported_triggers) {
      entity.supported_triggers = supported_triggers.map((it) =>
        plainToClass(TriggerEntity, {
          tenant: ctx.tenant,
          id: it.id,
        }),
      );
    }

    if (dependencies) {
      entity.dependencies = dependencies;
    }

    if (secrets) {
      entity.secrets = secrets;
    }

    return entity;
  }
}
