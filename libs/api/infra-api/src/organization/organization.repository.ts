import {
  OrganizationDto,
  UpdateOrganizationDto,
  CreateOrganizationDto,
  OrganizationEnabledConnectionDto,
  AddOrganizationEnabledConnectionDto,
  UpdateOrganizationEnabledConnectionDto,
} from './organization.dto';
import { QueryRepository, IContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { OrganizationMemberDto } from './organization-member.dto';

export interface IOrganizationRepository extends QueryRepository<OrganizationDto, CreateOrganizationDto, UpdateOrganizationDto> {
  paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>>;

  addMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<OrganizationMemberDto[]>;

  removeMembers(ctx: IContext, org_id: string, user_ids: string[]): Promise<void>;

  enabledConnections(ctx: IContext, org_id: string): Promise<PageDto<OrganizationEnabledConnectionDto>>;

  addConnection(
    ctx: IContext, 
    org_id: string, 
    connection: AddOrganizationEnabledConnectionDto,
  ): Promise<OrganizationEnabledConnectionDto>;

  deleteConnection(ctx: IContext, org_id: string, connection_id: string): Promise<void>;

  updateConnection(
    ctx: IContext, 
    org_id: string, 
    connection_id: string, 
    data: UpdateOrganizationEnabledConnectionDto
  ): Promise<OrganizationEnabledConnectionDto>;
}
