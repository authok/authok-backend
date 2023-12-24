import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { OrganizationMemberDto } from "./organization-member.dto";
import { PermissionDto } from "../permission/permission.dto";
import { IContext, QueryRepository } from "@libs/nest-core";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IOrganizationMemberRepository extends QueryRepository<OrganizationMemberDto> {
  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<OrganizationMemberDto>>;

  addRoles(ctx: IContext, member_id: string, role_ids: string[]);
  
  removeRoles(ctx: IContext, member_id: string, role_ids: string[]);

  listPermissions(ctx: IContext, org_id: string, user_id: string, query: PageQuery): Promise<PageDto<PermissionDto>>;
}