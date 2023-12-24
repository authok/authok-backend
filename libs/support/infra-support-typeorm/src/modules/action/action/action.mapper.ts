import { ActionEntity } from './action.entity';
import { ActionDto } from 'libs/api/infra-api/src/action/action/action.dto';
import { plainToClass } from 'class-transformer';
import { TriggerEntity } from '../trigger/trigger.entity';
import { IRequestContext } from '@libs/nest-core';

export class ActionMapper {
  toDTO(entity?: Partial<ActionEntity>): ActionDto | undefined {
    if (!entity) return undefined;

    const { supported_triggers, dependencies, secrets, ...rest } = entity;

    const model = plainToClass(ActionDto, rest);
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
    ctx: IRequestContext,
    model?: Partial<ActionDto>,
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
