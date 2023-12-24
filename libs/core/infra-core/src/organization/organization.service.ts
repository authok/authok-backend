import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { IOrganizationService } from 'libs/api/infra-api/src/organization/organization.service';
import { IOrganizationRepository } from 'libs/api/infra-api/src/organization/organization.repository';
import {
  OrganizationDto,
  UpdateOrganizationDto,
  OrganizationEnabledConnectionDto,
  AddOrganizationEnabledConnectionDto,
  UpdateOrganizationEnabledConnectionDto,
} from 'libs/api/infra-api/src/organization/organization.dto';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { IContext } from '@libs/nest-core';
import { OrganizationMemberDto } from 'libs/api/infra-api/src/organization/organization-member.dto';
import { IInvitationRepository } from 'libs/api/infra-api/src/invitation/invitation.repository';
import { APIException } from 'libs/common/src/exception/api.exception';
import { InvitationDto } from 'libs/api/infra-api/src/invitation/invitation.dto';

@Injectable()
export class OrganizationService implements IOrganizationService {
  constructor(
    @Inject('IOrganizationRepository')
    private organizationRepository: IOrganizationRepository,
    @Inject('IInvitationRepository')
    private invitationRepository: IInvitationRepository,
  ) {}

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<OrganizationDto | undefined> {
    return await this.organizationRepository.findById(ctx, id);
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<OrganizationDto | undefined> {
    return await this.organizationRepository.queryOne(ctx, {
      and: [
        {
          name: {
            eq: name,
          }
        }
      ]
    });
  }

  async create(
    ctx: IContext,
    input: OrganizationDto,
  ): Promise<OrganizationDto> {
    return await this.organizationRepository.createOne(ctx, input);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    await this.organizationRepository.deleteOne(ctx, id);
  }

  async update(
    ctx: IContext,
    id: string,
    body: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    return await this.organizationRepository.updateOne(ctx, id, body);
  }

  async paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>> {
    return await this.organizationRepository.paginate(ctx, query);
  }

  async addMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<OrganizationMemberDto[]> {
    return await this.organizationRepository.addMembers(ctx, org_id, user_ids);
  }

  async removeMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<void> {
    return await this.organizationRepository.removeMembers(ctx, org_id, user_ids);
  }

  async removeInvitation(ctx: IContext, org_id: string, invitation_id: string): Promise<void> {
    const invitation = await this.invitationRepository.getById(ctx, invitation_id);
    if (!invitation) return;
    
    if (invitation.org_id != org_id) {
      throw new APIException('invalid_request', '邀请不属于所在组织');
    }

    await this.invitationRepository.deleteOne(ctx, invitation_id);
  }

  async getInvitation(ctx: IContext, org_id: string, invitation_id: string): Promise<InvitationDto | undefined> {
    return await this.invitationRepository.queryOne(ctx, {
      and: [
        {
          id: {
            eq: invitation_id
          },
          org_id: {
            eq: org_id,
          },
        }
      ]
    });
  }

  async enabledConnections(ctx: IContext, org_id: string): Promise<PageDto<OrganizationEnabledConnectionDto>> {
    return await this.organizationRepository.enabledConnections(ctx, org_id);
  }

  async addConnection(
    ctx: IContext, 
    org_id: string, 
    connection: AddOrganizationEnabledConnectionDto,
  ): Promise<OrganizationEnabledConnectionDto> {
    return await this.organizationRepository.addConnection(ctx, org_id, connection);
  }

  async deleteConnection(ctx: IContext, org_id: string, connection_id: string): Promise<void> {
    return await this.organizationRepository.deleteConnection(ctx, org_id, connection_id);
  }

  async updateConnection(
    ctx: IContext, 
    org_id: string, 
    connection_id: string, 
    data: UpdateOrganizationEnabledConnectionDto
  ): Promise<OrganizationEnabledConnectionDto> {
    return await this.organizationRepository.updateConnection(ctx, org_id, connection_id, data);
  }

}
