import { TriggerModel } from 'libs/api/infra-api/src';
import { TriggerEntity } from './trigger.entity';
import { plainToClass } from 'class-transformer';

export class TriggerMapper {
  toEntity(model?: TriggerModel): TriggerEntity | undefined {
    if (!model) return undefined;

    const { ...rest } = model;

    const entity = plainToClass(TriggerEntity, rest);
    return entity;
  }

  toDTO(entity?: TriggerEntity): TriggerModel | undefined {
    if (!entity) return undefined;

    const { ...rest } = entity;

    const model = plainToClass(TriggerModel, rest);
    return model;
  }
}
