import { IContext } from '@libs/nest-core';
import { PermissionModel } from '../permission/permission.model';
import { OrganizationModel } from '../organization/organization.model';
import { FindOptions } from 'libs/common/src/types';
import { PostPermissions, UserModel } from './user.model';
import { IdentityModel, LinkIdentityReq } from '../identity/identity.model';
import { Page, PageQuery } from 'libs/common/src/pagination';

export interface IUserRepository {
  create(
    ctx: IContext,
    user: Partial<UserModel>,
  ): Promise<UserModel | undefined>;

  retrieve(ctx: IContext, user_id: string): Promise<UserModel | undefined>;

  update(
    ctx: IContext,
    user_id: string,
    user: Partial<UserModel>,
  ): Promise<UserModel>;

  delete(ctx: IContext, id: string): Promise<UserModel>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<UserModel>>;

  findByEmail(
    ctx: IContext,
    connection: string,
    email: string,
    options?: FindOptions,
  ): Promise<UserModel | undefined>;

  findByGuid(ctx: IContext, guid: string): Promise<UserModel | undefined>;

  findByUserIds(ctx: IContext, user_ids: string[]): Promise<Partial<UserModel>[]>;

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
    identity: Partial<IdentityModel>,
  ): Promise<{ affected?: number }>;

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
    id: string,
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
    query: PageQuery,
  ): Promise<Page<PermissionModel>>;

  updateGroupsToUser(
    ctx: IContext,
    user_id: string,
    group_ids: string[],
    overwrite: boolean,
  ): Promise<void>;

  linkIdentity(ctx: IContext, primaryUserId: string, linkIdentityReq: LinkIdentityReq): Promise<IdentityModel[]>;

  unlinkIdentity(ctx: IContext, primaryUserId: string, connection: string, secondaryUserId: string): Promise<IdentityModel[]>;

  listOrganizations(
    ctx: IContext,
    user_id: string,
    query: PageQuery,
  ): Promise<Page<OrganizationModel>>;
}
