import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import {
  OrganizationDto,
  UpdateOrganizationDto,
  OrganizationPageQueryDto,
  OrganizationEnabledConnectionDto,
  AddOrganizationEnabledConnectionDto,
  UpdateOrganizationEnabledConnectionDto,
} from './organization.dto';
import { ConnectionDto } from '../connection/connection.dto';
import { OrganizationMemberDto } from './organization-member.dto';
import { IContext } from '@libs/nest-core';
import { InvitationDto } from '../invitation/invitation.dto';

export interface IOrganizationService {
  retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<OrganizationDto | undefined>;

  findByName(
    ctx: IRequestContext,
    name: string,
  ): Promise<OrganizationDto | undefined>;

  update(
    ctx: IRequestContext,
    id: string,
    body: UpdateOrganizationDto,
  ): Promise<OrganizationDto>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  create(
    ctx: IRequestContext,
    body: Partial<OrganizationDto>,
  ): Promise<OrganizationDto>;

  paginate(
    ctx: IContext,
    query: OrganizationPageQueryDto,
  ): Promise<PageDto<OrganizationDto>>;

  addMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<OrganizationMemberDto[]>;

  removeMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<void>;

  getInvitation(ctx: IContext, org_id: string, invitation_id: string): Promise<InvitationDto | undefined>;

  removeInvitation(ctx: IContext, org_id: string, invitation_id: string): Promise<void>;

  enabledConnections(ctx: IContext, org_id: string): Promise<PageDto<OrganizationEnabledConnectionDto>>;

  addConnection(ctx: IContext, org_id: string, connection: AddOrganizationEnabledConnectionDto): Promise<OrganizationEnabledConnectionDto>;

  deleteConnection(ctx: IContext, org_id: string, connection_id: string): Promise<void>;

  updateConnection(ctx: IContext, org_id: string, connection_id: string, connection: UpdateOrganizationEnabledConnectionDto): Promise<OrganizationEnabledConnectionDto>;
}