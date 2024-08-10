import {
  Entity,
  Column,
  OneToMany,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserRoleEntity } from '../role/role.entity';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import * as _ from 'lodash';
import { IsEmail } from 'class-validator';
import { PermissionEntity } from '../permission/permission.entity';
import { GUID, GuidIdentity } from '../../common/guid.entity';
import { IdentityEntity } from '../identity/identity.entity';
import { UserGroupEntity } from '../group/user-group.entity';
import { GroupEntity } from '../group/group.entity';

export enum UserStatus {
  Suspended, // 已停用
  Resigned, // 已离职
  Activated, // 已激活（正常状态）
  Archived, // 已归档
}

@Entity({
  name: 'users',
  orderBy: {
    created_at: 'DESC',
  },
})
@Unique('idx_user_tenant_user_id', ['tenant', 'user_id'])
@Unique('idx_user_phone', ['tenant', 'connection', 'phone_number'])
@Unique('idx_user_email', ['tenant', 'connection', 'email'])
@Unique('idx_user_username', ['tenant', 'connection', 'username'])
@GUID({ len: 40 })
export class UserEntity extends GuidIdentity {
  @Column({ length: 80 })
  user_id: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user, {
    eager: false,
  })
  public roles: UserRoleEntity[];

  @OneToMany(
    () => UserGroupEntity,
    (userGroup: UserGroupEntity) => userGroup.user,
    {
      eager: false,
    },
  )
  public userGroups: UserGroupEntity[];

  get groups(): GroupEntity[] | undefined {
    return this.userGroups?.map((it) => it.group);
  }

  @ManyToMany(() => PermissionEntity, {
    eager: false,
  })
  @JoinTable({
    name: 'user_permissions',
    joinColumns: [
      { name: 'tenant', referencedColumnName: 'tenant' },
      { name: 'user_id', referencedColumnName: 'user_id' },
    ],
    inverseJoinColumns: [{ name: 'permission_id' }],
  })
  permissions: PermissionEntity[];

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  public password: string;

  @Column({
    type: 'bool',
    nullable: true,
    default: false,
  })
  public enabled2fa: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public secret2fa: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public signup_ip: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public last_ip: string;

  @Column({
    nullable: true,
    comment: '最后登录时间',
  })
  public last_login: Date;

  @Column({ nullable: false, length: 36 })
  tenant: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Activated,
    nullable: true,
  })
  status: UserStatus;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  register_source?: string[];

  @Column({ nullable: true })
  blocked: boolean;

  @Column({ nullable: false, length: 40 })
  connection: string;

  @Column({
    nullable: true,
    comment: '注册时间，从第三方系统过来的，和 created_at 有区别',
  })
  signup_at: Date;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  user_metadata: Record<string, any>;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  app_metadata: Record<string, any>;

  @OneToMany(() => IdentityEntity, (identity) => identity.user, {
    eager: true,
    cascade: true,
  })
  identities: IdentityEntity[];

  @Column({
    type: 'varchar',
    nullable: true,
    comment:
      "The user's username. Only valid if the connection requires a username.",
    length: 32,
  })
  public username: string;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: '全名',
  })
  public name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public given_name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public family_name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public nickname: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public picture: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public website: string;

  @Column({
    nullable: true,
  })
  public gender: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public birthdate: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public zoneinfo: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public locale: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 64,
  })
  @IsEmail()
  public email: string;

  @Column({
    type: 'bool',
    nullable: true,
    default: false,
  })
  public email_verified: boolean;

  @Column({
    type: 'bool',
    nullable: true,
  })
  public verify_email: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    length: '6',
  })
  phone_country_code: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 24,
  })
  public phone_number: string;

  @Column({
    type: 'bool',
    nullable: true,
    default: false,
  })
  public phone_number_verified: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public address: string;

  @Column({
    nullable: true,
  })
  public added: Date;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  postal_code: string;

  constructor(@Req() request?: Request) {
    super();
    try {
      if (request) {
        if (request.body) {
          const body = request.body;

          if (body.password) {
            this.password = body.password;
          }
          if (body.ip) {
            this.signup_ip = body.ip;
            this.last_ip = body.ip;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
