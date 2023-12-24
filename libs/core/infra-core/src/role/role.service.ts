import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  RoleDto,
  RolePageQueryDto,
  RolePermissionAssignmentDto,
  RoleUsersDto
} from 'libs/api/infra-api/src/role/role.dto';
import { IRoleRepository } from 'libs/api/infra-api/src/role/role.repository';
import { IRoleService } from 'libs/api/infra-api/src/role/role.service';
import { UserRoleDto } from 'libs/api/infra-api/src/user/user-role.dto';
import { IUserRoleRepository } from 'libs/api/infra-api/src/user/user-role.repository';
import { IUserRepository } from 'libs/api/infra-api/src/user/user.repository';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepo: IRoleRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IUserRoleRepository')
    private readonly userRoleRepo: IUserRoleRepository,
  ) {}

  public async create(
    ctx: IRequestContext,
    role: Partial<RoleDto>,
  ): Promise<RoleDto | undefined> {
    return await this.roleRepo.create(ctx, role);
  }

  public async batchCreate(ctx: IRequestContext, roles: Partial<RoleDto>[]) {
    return await this.roleRepo.batchCreate(ctx, roles);
  }

  public async paginate(
    ctx: IRequestContext,
    query: RolePageQueryDto,
  ): Promise<PageDto<RoleDto>> {
    return await this.roleRepo.paginate(ctx, query);
  }

  public async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<RoleDto | undefined> {
    return await this.roleRepo.retrieve(ctx, id);
  }

  public async update(
    ctx: IRequestContext,
    id: string,
    data: Partial<RoleDto>,
  ) {
    const updateResult = await this.roleRepo.update(ctx, id, data);
    if (!updateResult.affected) {
      throw new NotFoundException(`Role id: ${id} not found`);
    }
    return await this.roleRepo.retrieve(ctx, id);
  }

  public async delete(ctx: IRequestContext, id: string): Promise<void> {
    await this.roleRepo.delete(ctx, id);
  }

  async addPermissions(
    ctx: IRequestContext,
    id: string,
    data: RolePermissionAssignmentDto,
  ): Promise<void> {
    await this.roleRepo.addPermissions(ctx, id, data);
  }

  async removePermissions(
    ctx: IRequestContext,
    id: string,
    data: RolePermissionAssignmentDto,
  ): Promise<void> {
    await this.roleRepo.removePermissions(ctx, id, data);
  }

  async assignUsers(
    ctx: IRequestContext,
    id: string,
    data: RoleUsersDto,
  ): Promise<void> {
    const role = await this.roleRepo.retrieve(ctx, id);
    if (!role) throw new NotFoundException(`Role id: ${id} not found`);

    const users = await this.userRepo.findByUserIds(ctx, data.users);
    const userRoles: Partial<UserRoleDto>[] = users.map((it) => ({
      role_id: id,
      user_id: it.user_id,
    }));

    await this.userRoleRepo.batchCreate(ctx, userRoles);
  }

  async unassignUsers(
    ctx: IRequestContext,
    id: string,
    data: RoleUsersDto,
  ): Promise<void> {
    const role = await this.roleRepo.retrieve(ctx, id);
    if (!role) throw new NotFoundException(`Role id: ${id} not found`);

    const users = await this.userRepo.findByUserIds(ctx, data.users);
    const userRoles: Partial<UserRoleDto>[] = users.map((it) => ({
      role_id: id,
      user_id: it.user_id,
    }));

    await this.userRoleRepo.batchDelete(ctx, userRoles);
  }
}
