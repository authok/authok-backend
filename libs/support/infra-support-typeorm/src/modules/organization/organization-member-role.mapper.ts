import { plainToClass } from 'class-transformer';
import { OrganizationMemberDto } from 'libs/api/infra-api/src/organization/organization-member.dto';
import { OrganizationMemberRoleModel } from 'libs/api/infra-api/src/organization/organization-member-role.model';
import {
  OrganizationMemberRoleEntity,
  OrganizationMemberEntity,
} from './organization.entity';
import { RoleEntity } from '../role/role.entity';
import { UserDto } from 'libs/api/infra-api/src/user/user.dto';
import { RoleDto } from 'libs/api/infra-api/src/role/role.dto';

export class OrganizationMemberRoleMapper {
  toEntity(
    model?: Partial<OrganizationMemberRoleModel>,
  ): OrganizationMemberRoleEntity | undefined {
    if (!model) return undefined;

    const { member, role, ...rest } = model;

    const entity = plainToClass(OrganizationMemberRoleEntity, rest);
    if (member) {
      entity.member = plainToClass(OrganizationMemberEntity, {
        id: member.id,
        user_id: member.user.user_id,
      });
    }

    if (role) {
      entity.role = plainToClass(RoleEntity, {
        id: role.id,
      });
    }

    return entity;
  }

  toDTO(
    entity?: Partial<OrganizationMemberRoleEntity>,
  ): OrganizationMemberRoleModel | undefined {
    if (!entity) return undefined;

    const { member, role, ...rest } = entity;

    const model = plainToClass(OrganizationMemberRoleModel, rest);
    if (member) {
      const { user } = member;
      model.member_id = member.id;
      model.member = plainToClass(OrganizationMemberDto, {
        id: member.id,
      });

      if (user) {
        model.user = plainToClass(UserDto, {
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
        })
      }
    }

    if (role) {
      model.role = plainToClass(RoleDto, role);
    }

    return model;
  }
}
