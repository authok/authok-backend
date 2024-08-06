import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { Inject, Injectable } from "@nestjs/common";
import { IOrganizationMemberRepository } from "libs/api/infra-api/src/organization/organization-member.repository";
import { IOrganizationMemberService } from "libs/api/infra-api/src/organization/organization-member.service";
import { OrganizationMemberDto } from "libs/api/infra-api/src/organization/organization-member.dto";
import { PermissionDto } from "libs/api/infra-api/src/permission/permission.dto";
import { IContext } from "@libs/nest-core";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

@Injectable()
export class OrganizationMemberService implements IOrganizationMemberService {
  constructor(
    @Inject('IOrganizationMemberRepository')
    private readonly organizationMemberRepository: IOrganizationMemberRepository,
  ) {}
  
  async create(ctx: IContext, organizationMember: Partial<OrganizationMemberDto>): Promise<OrganizationMemberDto> {
    return await this.organizationMemberRepository.createOne(ctx, organizationMember);
  }

  async retrieve(ctx: IContext, id: string): Promise<OrganizationMemberDto | undefined> {
    return await this.organizationMemberRepository.findById(ctx, id);
  }

  async findByRelation(ctx: IContext, org_id: string, user_id: string): Promise<OrganizationMemberDto | undefined> {
    return await this.organizationMemberRepository.findByOrgIdAndUserId(ctx, org_id, user_id);
  }

  async update(ctx: IContext, id: string, organizationMember: Partial<OrganizationMemberDto>): Promise<OrganizationMemberDto> {
    return await this.organizationMemberRepository.updateOne(ctx, id, organizationMember);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    await this.organizationMemberRepository.deleteOne(ctx, id);
  }

  async paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<OrganizationMemberDto>> {
    return await this.organizationMemberRepository.paginate(ctx, query);
  }

  async addRoles(ctx: IContext, member_id: string, role_ids: string[]) {
    await this.organizationMemberRepository.addRoles(ctx, member_id, role_ids);
  }
  
  async removeRoles(ctx: IContext, member_id: string, role_ids: string[]) {
    await this.organizationMemberRepository.removeRoles(ctx, member_id, role_ids);
  }

  async listPermissions(ctx: IContext, org_id: string, user_id: string, query: PageQuery): Promise<PageDto<PermissionDto>> {
    return this.organizationMemberRepository.listPermissions(ctx, org_id, user_id, query);
  }

}