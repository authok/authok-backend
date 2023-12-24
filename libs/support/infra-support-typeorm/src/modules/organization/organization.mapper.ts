import { plainToClass } from 'class-transformer';
import { OrganizationEntity } from './organization.entity';
import { OrganizationDto } from 'libs/api/infra-api/src/organization/organization.dto';
import { BrandingEntity } from '../branding/branding.entity';
import { BrandingDto } from 'libs/api/infra-api/src/branding/branding.dto';
import { Mapper, ClassTransformerMapper } from '@libs/nest-core';

@Mapper(OrganizationDto, OrganizationEntity)
export class OrganizationMapper extends ClassTransformerMapper<
  OrganizationDto,
  OrganizationEntity
> {
  convertToDTO(entity: OrganizationEntity): OrganizationDto {
    const { branding, ...rest } = entity;

    const dto = super.convertToDTO(rest as OrganizationEntity);

    if (branding) {
      dto.branding = plainToClass(BrandingDto, branding);
    }

    return dto;
  }

  convertToEntity(dto: OrganizationDto): OrganizationEntity {
    const { branding, ...rest } = dto;

    const entity = super.convertToEntity(rest as OrganizationDto);
    if (branding) {
      entity.branding = plainToClass(BrandingEntity, branding);
    }

    return entity;
  }
}
