import { InvitationEntity } from './invitation.entity';
import { 
  UserModel,
  InvitationModel,
} from 'libs/api/infra-api/src';
import { Mapper, ClassTransformerMapper, DeepPartial } from '@libs/nest-core';
import { ClientEntity } from '../client/client.entity';
import { OrganizationEntity } from '../organization/organization.entity';

@Mapper(InvitationModel, InvitationEntity)
export class InvitationMapper extends ClassTransformerMapper<
  InvitationModel,
  InvitationEntity
> {
  convertToCreateEntity(
    create: DeepPartial<InvitationModel>,
  ): DeepPartial<InvitationEntity> {
    return this.convertToEntity(create as InvitationModel);
  }

  convertToEntity(dto: InvitationModel): InvitationEntity {
    const { client_id, org_id, inviter, ...rest } = dto;

    const entity = super.convertToEntity(rest as InvitationModel);
    if (inviter) {
      entity.inviter = {
        tenant: dto.tenant,
        user_id: inviter.user_id,
      };
    }

    entity.client = {
      client_id,
    } as ClientEntity;

    entity.organization = {
      id: org_id,
    } as OrganizationEntity;

    console.log('转型: ', entity);

    return entity;
  }

  convertToDTO(entity: InvitationEntity): InvitationModel {
    const { tenant, organization, client, inviter: _inviter, ...rest } = entity;

    const inviter = {
      ...(_inviter && { id: _inviter.id }),
      ...(_inviter && { user_id: _inviter.user_id }),
      ...(_inviter && { name: _inviter.name }),
      ...(_inviter && { username: _inviter.username }),
      ...(_inviter && { nickname: _inviter.nickname }),
      ...(_inviter && { email: _inviter.email }),
      ...(_inviter && { phone_number: _inviter.phone_number }),
    } as Partial<UserModel>;

    const dto = {
      inviter,
      ...rest,
    } as InvitationModel;

    return dto;
  }
}
