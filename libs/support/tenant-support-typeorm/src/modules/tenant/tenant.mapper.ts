import { TenantDto } from 'libs/api/infra-api/src/tenant/tenant.dto';
import { TenantEntity } from './tenant.entity';
import { plainToClass } from 'class-transformer';

export class TenantMapper {
  toDTO(entity?: TenantEntity): TenantDto | undefined {
    if (!entity) return undefined;

    return plainToClass(TenantDto, entity);
  }

  toEntity(model?: TenantDto): TenantEntity | undefined {
    if (!model) return undefined;

    return plainToClass(TenantEntity, model);
  }
}
