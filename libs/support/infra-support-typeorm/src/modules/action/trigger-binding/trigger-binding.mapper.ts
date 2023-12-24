import { TriggerBindingEntity } from './trigger-binding.entity';
import { plainToClass } from 'class-transformer';
import { TriggerBindingDto } from 'libs/api/infra-api/src/action/trigger-binding/trigger-binding.dto';

export class TriggerBindingMapper {
  toEntity(model?: TriggerBindingDto): TriggerBindingEntity | undefined {
    if (!model) return undefined;

    const { ...rest } = model;

    const entity = plainToClass(TriggerBindingEntity, rest);
    return entity;
  }

  toDTO(entity?: TriggerBindingEntity): TriggerBindingDto | undefined {
    if (!entity) return undefined;

    const { ...rest } = entity;

    const model = plainToClass(TriggerBindingDto, rest);
    return model;
  }
}
