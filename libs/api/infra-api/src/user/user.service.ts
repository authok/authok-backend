import { IdentityDto, LinkIdentityReq } from '../identity/identity.dto';
import {
  PostPermissionsDto,
  UserDto,
  UserPageQueryDto,
  CreateUserDto,
} from './user.dto';
import { IRequestContext, IContext } from '@libs/nest-core';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { PostUserRoleDto } from '../role/role.dto';
import { PermissionDto } from '../permission/permission.dto';
import { OrganizationDto } from '../organization/organization.dto';
import { UserRoleDto } from './user-role.dto';
import { FindOptions } from 'libs/common/src/types';

export interface IUserService {
  create(
    ctx: IRequestContext,
    user: Partial<CreateUserDto>,
  ): Promise<UserDto | null>;

  update(
    ctx: IRequestContext,
    id: string,
    data: Partial<UserDto>,
  ): Promise<UserDto>;

  delete(ctx: IRequestContext, id: string);

  paginate(
    ctx: IRequestContext,
    query: UserPageQueryDto,
  ): Promise<PageDto<UserDto>>;

  retrieve(ctx: IRequestContext, id: string): Promise<UserDto | undefined>;

  linkIdentity(
    ctx: IRequestContext,
    primaryUserId: string,
    linkIdentityReq: LinkIdentityReq,
  ): Promise<IdentityDto[]>;

  unlinkIdentity(
    ctx: IRequestContext,
    primaryUserId: string,
    connection: string,
    secondaryUserId: string,
  ): Promise<IdentityDto[]>;

  findByGuid(ctx: IRequestContext, guid: string): Promise<UserDto | undefined>;

  userVerifiedEmail(ctx: IRequestContext, id: string);

  validateUser(ctx: IRequestContext, user: UserDto, passowrd: string);

  enable2fa(ctx: IRequestContext, user_id: string);

  disable2fa(ctx: IRequestContext, user_id: string);

  findByEmail(
    ctx: IRequestContext,
    connection: string,
    email: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined>;

  findByPhoneNumber(
    ctx: IRequestContext,
    connection: string,
    phone_number: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined>;

  findByUsername(
    ctx: IRequestContext,
    connection: string,
    username: string,
    options?: FindOptions,
  ): Promise<UserDto | undefined>;

  findByConnection(
    ctx: IRequestContext,
    connection: string,
    user_id: string,
  ): Promise<UserDto | undefined>;

  findByIdentityProvider(
    ctx: IRequestContext,
    provider: string,
    user_id: string,
  ): Promise<UserDto | undefined>;

  updateFederatedIdentity(
    ctx: IRequestContext,
    identity: IdentityDto,
  ): Promise<IdentityDto>;

  addFederatedIdentity(
    ctx: IContext,
    user_id: string,
    identity: IdentityDto,
  ): Promise<IdentityDto>;

  removeFederatedIdentity(
    ctx: IRequestContext,
    user_id: string,
    provider: string,
  ): Promise<void>;

  assignPermissions(
    ctx: IRequestContext,
    user_id: string,
    body: PostPermissionsDto,
  ): Promise<void>;

  removePermissions(
    ctx: IRequestContext,
    user_id: string,
    body: PostPermissionsDto,
  ): Promise<void>;

  paginatePermissions(
    ctx: IRequestContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<PermissionDto>>;

  addRolesToUser(
    ctx: IRequestContext,
    user_id: string,
    body: PostUserRoleDto,
  ): Promise<void>;

  removeRolesToUser(
    ctx: IRequestContext,
    user_id: string,
    body: PostUserRoleDto,
  ): Promise<void>;

  listRoles(
    ctx: IRequestContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<UserRoleDto>>;

  /**
   * 更新，删除之前的
   */
  updateGroupsToUser(
    ctx: IRequestContext,
    user_id: string,
    group_ids: string[],
    overwrite: boolean,
  ): Promise<void>;

  listOrganizations(
    ctx: IRequestContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>>;

  startResetPasswordByEmail(
    ctx: IRequestContext,
    connection: string,
    email: string,
    ip: string,
  ): Promise<void>;
}
