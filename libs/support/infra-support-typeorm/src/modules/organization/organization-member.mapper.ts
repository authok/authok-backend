import { plainToClass } from 'class-transformer';
import {
  OrganizationEntity,
  OrganizationMemberEntity,
} from './organization.entity';
import { 
  OrganizationModel,
  OrganizationMemberModel,
  UserModel,
} from 'libs/api/infra-api/src';
import { UserEntity } from '../user/user.entity';
import { Mapper, ClassTransformerMapper } from '@libs/nest-core';

@Mapper(OrganizationMemberModel, OrganizationMemberEntity)
export class OrganizationMemberMapper extends ClassTransformerMapper<
  OrganizationMemberModel,
  OrganizationMemberEntity
> {
  convertToDTO(entity: OrganizationMemberEntity): OrganizationMemberModel {
    const { organization, user, roles, ...rest } = entity;

    const dto = super.convertToDTO(rest as OrganizationMemberEntity);

    if (organization) {
      dto.organization = plainToClass(OrganizationModel, {
        id: organization.id,
        ...(organization.name && { name: organization.name }),
        ...(organization.display_name && { name: organization.display_name }),
      });
    }

    if (user) {
      dto.user = plainToClass(UserModel, {
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

    dto.roles = roles;

    return dto;
  }

  convertToEntity(dto: OrganizationMemberModel): OrganizationMemberEntity {
    const { organization, user, ...rest } = dto;

    const entity = super.convertToEntity(rest as OrganizationMemberModel);
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
