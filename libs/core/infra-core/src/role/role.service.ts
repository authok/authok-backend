import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  RoleModel,
  RolePageQuery,
  RolePermissionAssignmentModel,
  RoleUsersModel,
  IRoleRepository,
  IRoleService,
  UserRoleModel,
  IUserRoleRepository,
  IUserRepository,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { Page } from 'libs/common/src/pagination';

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
    ctx: IContext,
    role: Partial<RoleModel>,
  ): Promise<RoleModel | undefined> {
    return await this.roleRepo.create(ctx, role);
  }

  public async batchCreate(ctx: IContext, roles: Partial<RoleModel>[]) {
    return await this.roleRepo.batchCreate(ctx, roles);
  }

  public async paginate(
    ctx: IContext,
    query: RolePageQuery,
  ): Promise<Page<RoleModel>> {
    return await this.roleRepo.paginate(ctx, query);
  }

  public async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<RoleModel | undefined> {
    return await this.roleRepo.retrieve(ctx, id);
  }

  public async update(
    ctx: IContext,
    id: string,
    data: Partial<RoleModel>,
  ) {
    const updateResult = await this.roleRepo.update(ctx, id, data);
    if (!updateResult.affected) {
      throw new NotFoundException(`Role id: ${id} not found`);
    }
    return await this.roleRepo.retrieve(ctx, id);
  }

  public async delete(ctx: IContext, id: string): Promise<void> {
    await this.roleRepo.delete(ctx, id);
  }

  async addPermissions(
    ctx: IContext,
    id: string,
    data: RolePermissionAssignmentModel,
  ): Promise<void> {
    await this.roleRepo.addPermissions(ctx, id, data);
  }

  async removePermissions(
    ctx: IContext,
    id: string,
    data: RolePermissionAssignmentModel,
  ): Promise<void> {
    await this.roleRepo.removePermissions(ctx, id, data);
  }

  async assignUsers(
    ctx: IContext,
    id: string,
    data: RoleUsersModel,
  ): Promise<void> {
    const role = await this.roleRepo.retrieve(ctx, id);
    if (!role) throw new NotFoundException(`Role id: ${id} not found`);

    const users = await this.userRepo.findByUserIds(ctx, data.users);
    const userRoles: Partial<UserRoleModel>[] = users.map((it) => ({
      role_id: id,
      user_id: it.user_id,
    }));

    await this.userRoleRepo.batchCreate(ctx, userRoles);
  }

  async unassignUsers(
    ctx: IContext,
    id: string,
    data: RoleUsersModel,
  ): Promise<void> {
    const role = await this.roleRepo.retrieve(ctx, id);
    if (!role) throw new NotFoundException(`Role id: ${id} not found`);

    const users = await this.userRepo.findByUserIds(ctx, data.users);
    const userRoles: Partial<UserRoleModel>[] = users.map((it) => ({
      role_id: id,
      user_id: it.user_id,
    }));

    await this.userRoleRepo.batchDelete(ctx, userRoles);
  }
}
