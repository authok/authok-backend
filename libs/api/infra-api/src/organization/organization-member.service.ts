import { IContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { OrganizationMemberDto } from "./organization-member.dto";
import { PermissionDto } from "../permission/permission.dto";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IOrganizationMemberService {
  create(ctx: IContext, groupMember: Partial<OrganizationMemberDto>): Promise<OrganizationMemberDto>;

  retrieve(ctx: IContext, member_id: string): Promise<OrganizationMemberDto | undefined>;

  findByRelation(ctx: IContext, org_id: string, user_id: string): Promise<OrganizationMemberDto | undefined>;

  update(ctx: IContext, member_id: string, data: Partial<OrganizationMemberDto>): Promise<OrganizationMemberDto>;

  delete(ctx: IContext, member_id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<OrganizationMemberDto>>;

  addRoles(ctx: IContext, member_id: string, role_ids: string[]);
  
  removeRoles(ctx: IContext, member_id: string, role_ids: string[]);

  listPermissions(ctx: IContext, org_id: string, user_id: string, query: PageQuery): Promise<PageDto<PermissionDto>>;
}