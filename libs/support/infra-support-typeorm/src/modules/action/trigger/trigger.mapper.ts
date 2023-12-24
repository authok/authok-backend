import { TriggerDto } from 'libs/api/infra-api/src/action/trigger/trigger.dto';
import { TriggerEntity } from './trigger.entity';
import { plainToClass } from 'class-transformer';

export class TriggerMapper {
  toEntity(model?: TriggerDto): TriggerEntity | undefined {
    if (!model) return undefined;

    const { ...rest } = model;

    const entity = plainToClass(TriggerEntity, rest);
    return entity;
  }

  toDTO(entity?: TriggerEntity): TriggerDto | undefined {
    if (!entity) return undefined;

    const { ...rest } = entity;

    const model = plainToClass(TriggerDto, rest);
    return model;
  }
}
