import { IContext } from '@libs/nest-core';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination';
import { PostUserRoleModel } from '../role/role.model';
import { PermissionModel } from '../permission/permission.model';
import { OrganizationModel } from '../organization/organization.model';
import { UserRoleModel } from './user-role.model';
import { FindOptions } from 'libs/common/src/types';
import { CreateUserModel, PostPermissions, UserModel } from './user.model';
import { IdentityModel, LinkIdentityReq } from '../identity/identity.model';
import { Page, PageQuery } from 'libs/common/src/pagination';

export interface IUserService {
  create(
    ctx: IContext,
    user: Partial<CreateUserModel>,
  ): Promise<UserModel | null>;

  update(
    ctx: IContext,
    id: string,
    data: Partial<UserModel>,
  ): Promise<UserModel>;

  delete(ctx: IContext, id: string);

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<PageDto<UserModel>>;

  retrieve(ctx: IContext, id: string): Promise<UserModel | undefined>;

  linkIdentity(
    ctx: IContext,
    primaryUserId: string,
    linkIdentityReq: LinkIdentityReq,
  ): Promise<IdentityModel[]>;

  unlinkIdentity(
    ctx: IContext,
    primaryUserId: string,
    connection: string,
    secondaryUserId: string,
  ): Promise<IdentityModel[]>;

  findByGuid(ctx: IContext, guid: string): Promise<UserModel | undefined>;

  userVerifiedEmail(ctx: IContext, id: string);

  validateUser(ctx: IContext, user: UserModel, passowrd: string);

  enable2fa(ctx: IContext, user_id: string);

  disable2fa(ctx: IContext, user_id: string);

  findByEmail(
    ctx: IContext,
    connection: string,
    email: string,
    options?: FindOptions,
  ): Promise<UserModel | undefined>;

  findByPhoneNumber(
    ctx: IContext,
    connection: string,
    phone_number: string,
    options?: FindOptions,
  ): Promise<UserModel | undefined>;

  findByUsername(
    ctx: IContext,
    connection: string,
    username: string,
    options?: FindOptions,
  ): Promise<UserModel | undefined>;

  findByConnection(
    ctx: IContext,
    connection: string,
    user_id: string,
  ): Promise<UserModel | undefined>;

  findByIdentityProvider(
    ctx: IContext,
    provider: string,
    user_id: string,
  ): Promise<UserModel | undefined>;

  updateFederatedIdentity(
    ctx: IContext,
    identity: IdentityModel,
  ): Promise<IdentityModel>;

  addFederatedIdentity(
    ctx: IContext,
    user_id: string,
    identity: IdentityModel,
  ): Promise<IdentityModel>;

  removeFederatedIdentity(
    ctx: IContext,
    user_id: string,
    provider: string,
  ): Promise<void>;

  assignPermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissions,
  ): Promise<void>;

  removePermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissions,
  ): Promise<void>;

  paginatePermissions(
    ctx: IContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<PermissionModel>>;

  addRolesToUser(
    ctx: IContext,
    user_id: string,
    body: PostUserRoleModel,
  ): Promise<void>;

  removeRolesToUser(
    ctx: IContext,
    user_id: string,
    body: PostUserRoleModel,
  ): Promise<void>;

  listRoles(
    ctx: IContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<UserRoleModel>>;

  /**
   * 更新，删除之前的
   */
  updateGroupsToUser(
    ctx: IContext,
    user_id: string,
    group_ids: string[],
    overwrite: boolean,
  ): Promise<void>;

  listOrganizations(
    ctx: IContext,
    user_id: string,
    query: PageQuery,
  ): Promise<Page<OrganizationModel>>;

  startResetPasswordByEmail(
    ctx: IContext,
    connection: string,
    email: string,
    ip: string,
  ): Promise<void>;
}
