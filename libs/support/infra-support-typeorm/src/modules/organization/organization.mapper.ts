import { plainToClass } from 'class-transformer';
import { OrganizationEntity } from './organization.entity';
import { 
  OrganizationModel,
  BrandingModel,
} from 'libs/api/infra-api/src';
import { BrandingEntity } from '../branding/branding.entity';
import { Mapper, ClassTransformerMapper } from '@libs/nest-core';

@Mapper(OrganizationModel, OrganizationEntity)
export class OrganizationMapper extends ClassTransformerMapper<
  OrganizationModel,
  OrganizationEntity
> {
  convertToDTO(entity: OrganizationEntity): OrganizationModel {
    const { branding, ...rest } = entity;

    const dto = super.convertToDTO(rest as OrganizationEntity);

    if (branding) {
      dto.branding = plainToClass(BrandingModel, branding);
    }

    return dto;
  }

  convertToEntity(dto: OrganizationModel): OrganizationEntity {
    const { branding, ...rest } = dto;

    const entity = super.convertToEntity(rest as OrganizationModel);
    if (branding) {
      entity.branding = plainToClass(BrandingEntity, branding);
    }

    return entity;
  }
}
