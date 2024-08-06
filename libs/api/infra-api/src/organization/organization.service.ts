import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import {
  OrganizationModel,
  UpdateOrganizationModel,
  OrganizationPageQuery,
  OrganizationEnabledConnection,
  AddOrganizationEnabledConnection,
  UpdateOrganizationEnabledConnection,
} from './organization.model';
import { IContext } from '@libs/nest-core';
import { InvitationModel } from '../invitation/invitation.model';
import { OrganizationMemberModel } from './organization-member.model';

export interface IOrganizationService {
  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<OrganizationModel | undefined>;

  findByName(
    ctx: IContext,
    name: string,
  ): Promise<OrganizationModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    body: UpdateOrganizationModel,
  ): Promise<OrganizationModel>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  create(
    ctx: IContext,
    body: Partial<OrganizationModel>,
  ): Promise<OrganizationModel>;

  paginate(
    ctx: IContext,
    query: OrganizationPageQuery,
  ): Promise<PageDto<OrganizationModel>>;

  addMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<OrganizationMemberModel[]>;

  removeMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<void>;

  getInvitation(ctx: IContext, org_id: string, invitation_id: string): Promise<InvitationModel | undefined>;

  removeInvitation(ctx: IContext, org_id: string, invitation_id: string): Promise<void>;

  enabledConnections(ctx: IContext, org_id: string): Promise<PageDto<OrganizationEnabledConnection>>;

  addConnection(ctx: IContext, org_id: string, connection: AddOrganizationEnabledConnection): Promise<OrganizationEnabledConnection>;

  deleteConnection(ctx: IContext, org_id: string, connection_id: string): Promise<void>;

  updateConnection(ctx: IContext, org_id: string, connection_id: string, connection: UpdateOrganizationEnabledConnection): Promise<OrganizationEnabledConnection>;
}