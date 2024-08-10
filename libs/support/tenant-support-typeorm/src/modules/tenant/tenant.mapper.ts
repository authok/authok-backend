import { TenantModel } from 'libs/api/infra-api/src';
import { TenantEntity } from './tenant.entity';
import { plainToClass } from 'class-transformer';

export class TenantMapper {
  toDTO(entity?: TenantEntity): TenantModel | undefined {
    if (!entity) return undefined;

    return plainToClass(TenantModel, entity);
  }

  toEntity(model?: TenantModel): TenantEntity | undefined {
    if (!model) return undefined;

    return plainToClass(TenantEntity, model);
  }
}
