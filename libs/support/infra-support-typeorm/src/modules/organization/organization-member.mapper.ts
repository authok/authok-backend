import { plainToClass } from 'class-transformer';
import {
  OrganizationEntity,
  OrganizationMemberEntity,
} from './organization.entity';
import { OrganizationDto } from 'libs/api/infra-api/src/organization/organization.dto';
import { OrganizationMemberDto } from 'libs/api/infra-api/src/organization/organization-member.dto';
import { UserEntity } from '../user/user.entity';
import { UserDto } from 'libs/api/infra-api/src/user/user.dto';
import { Mapper, ClassTransformerMapper } from '@libs/nest-core';

@Mapper(OrganizationMemberDto, OrganizationMemberEntity)
export class OrganizationMemberMapper extends ClassTransformerMapper<
  OrganizationMemberDto,
  OrganizationMemberEntity
> {
  convertToDTO(entity: OrganizationMemberEntity): OrganizationMemberDto {
    const { organization, user, roles, ...rest } = entity;

    const dto = super.convertToDTO(rest as OrganizationMemberEntity);

    if (organization) {
      dto.organization = plainToClass(OrganizationDto, {
        id: organization.id,
        ...(organization.name && { name: organization.name }),
        ...(organization.display_name && { name: organization.display_name }),
      });
    }

    if (user) {
      dto.user = plainToClass(UserDto, {
        user_id: user.user_id,
        ...(user.nickname && { nickname: user.nickname }),
        ...(user.username && { username: user.username }),
        ...(user.email && { email: user.email }),
        ...(user.name && { name: user.name }),
        ...(user.phone_number && { phone_number: user.phone_number }),
        ...(user.phone_country_code && {
          phone_country_code: user.phone_country_code,
        }),
        ...(user.picture && { picture: user.picture }),
        ...(user.gender && { gender: user.gender }),
      });
    }

    if (roles) {
      dto.roles = roles.map(it => ({
        id: it.role?.id,
        name: it.role?.name,
      }))
    }

    return dto;
  }

  convertToEntity(dto: OrganizationMemberDto): OrganizationMemberEntity {
    const { organization, user, ...rest } = dto;

    const entity = super.convertToEntity(rest as OrganizationMemberDto);
    if (organization) {
      entity.organization = plainToClass(OrganizationEntity, {
        id: organization.id,
      });
    }

    if (user) {
      entity.user = plainToClass(UserEntity, {
        tenant: dto.tenant,
        user_id: user.user_id,
      });
    }

    return entity;
  }
}
