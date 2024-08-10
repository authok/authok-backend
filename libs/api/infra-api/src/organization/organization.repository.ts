import {
  OrganizationModel,
  UpdateOrganizationModel,
  CreateOrganizationModel,
  OrganizationEnabledConnection,
  AddOrganizationEnabledConnection,
  UpdateOrganizationEnabledConnection,
} from './organization.model';
import { QueryRepository, IContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { OrganizationMemberModel } from './organization-member.model';

export interface IOrganizationRepository extends QueryRepository<OrganizationModel, CreateOrganizationModel, UpdateOrganizationModel> {
  paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationModel>>;

  addMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<OrganizationMemberModel[]>;

  removeMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<void>;

  enabledConnections(ctx: IContext, org_id: string): Promise<PageDto<OrganizationEnabledConnection>>;

  addConnection(
    ctx: IContext, 
    org_id: string, 
    connection: AddOrganizationEnabledConnection,
  ): Promise<OrganizationEnabledConnection>;

  deleteConnection(ctx: IContext, org_id: string, connection_id: string): Promise<void>;

  updateConnection(
    ctx: IContext, 
    org_id: string, 
    connection_id: string, 
    data: UpdateOrganizationEnabledConnection
  ): Promise<OrganizationEnabledConnection>;
}
