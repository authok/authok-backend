import { TriggerBindingEntity } from './trigger-binding.entity';
import { plainToClass } from 'class-transformer';
import { TriggerBindingModel } from 'libs/api/infra-api/src';

export class TriggerBindingMapper {
  toEntity(model?: TriggerBindingModel): TriggerBindingEntity | undefined {
    if (!model) return undefined;

    const { ...rest } = model;

    const entity = plainToClass(TriggerBindingEntity, rest);
    return entity;
  }

  toDTO(entity?: TriggerBindingEntity): TriggerBindingModel | undefined {
    if (!entity) return undefined;

    const { ...rest } = entity;

    const model = plainToClass(TriggerBindingModel, rest);
    return model;
  }
}
