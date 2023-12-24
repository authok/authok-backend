import { IdentityDto, LinkIdentityReq } from '../identity/identity.dto';
import {
  PostPermissionsDto,
  UserDto,
  UserPageQueryDto,
} from './user.dto';
import { IContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { PermissionDto } from '../permission/permission.dto';
import { OrganizationDto } from '../organization/organization.dto';
import { FindOptions } from 'libs/common/src/types';

export interface IUserRepository {
  create(
    ctx: IContext,
    user: Partial<UserDto>,
  ): Promise<UserDto | undefined>;

  retrieve(ctx: IContext, user_id: string): Promise<UserDto | undefined>;

  update(
    ctx: IContext,
    user_id: string,
    user: Partial<UserDto>,
  ): Promise<UserDto>;

  delete(ctx: IContext, id: string): Promise<UserDto>;

  paginate(
    ctx: IContext,
    query: UserPageQueryDto,
  ): Promise<PageDto<UserDto>>;

  findByEmail(
    ctx: IContext,
    connection: string,
    email: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined>;

  findByGuid(ctx: IContext, guid: string): Promise<UserDto | undefined>;

  findByUserIds(ctx: IContext, user_ids: string[]): Promise<Partial<UserDto>[]>;

  findByPhoneNumber(
    ctx: IContext,
    connection: string,
    phone_number: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined>;

  findByUsername(
    ctx: IContext,
    connection: string,
    username: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined>;

  findByConnection(
    ctx: IContext,
    connection: string,
    user_id: string,
  ): Promise<UserDto | undefined>;

  findByIdentityProvider(
    ctx: IContext,
    provider: string,
    user_id: string,
  ): Promise<UserDto | undefined>;

  updateFederatedIdentity(
    ctx: IContext,
    identity: Partial<IdentityDto>,
  ): Promise<{ affected?: number }>;

  addFederatedIdentity(
    ctx: IContext,
    user_id: string,
    identity: IdentityDto,
  ): Promise<IdentityDto>;

  removeFederatedIdentity(
    ctx: IContext,
    user_id: string,
    provider: string,
  ): Promise<void>;

  assignPermissions(
    ctx: IContext,
    id: string,
    body: PostPermissionsDto,
  ): Promise<void>;

  removePermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissionsDto,
  ): Promise<void>;

  paginatePermissions(
    ctx: IContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<PermissionDto>>;

  updateGroupsToUser(
    ctx: IContext,
    user_id: string,
    group_ids: string[],
    overwrite: boolean,
  ): Promise<void>;

  linkIdentity(ctx: IContext, primaryUserId: string, linkIdentityReq: LinkIdentityReq): Promise<IdentityDto[]>;

  unlinkIdentity(ctx: IContext, primaryUserId: string, connection: string, secondaryUserId: string): Promise<IdentityDto[]>;

  listOrganizations(
    ctx: IContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>>;
}
