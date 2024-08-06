import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
  ManyToOne,
  JoinTable,
  ManyToMany,
  Unique,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { BrandingEntity } from '../branding/branding.entity';
import { RoleEntity } from '../role/role.entity';
import { UserEntity } from '../user/user.entity';
import { GuidIdentity, GUID } from '../../common/guid.entity';
import { OrganizationEnabledConnectionEntity } from './enabled-connection.entity';

@Entity({
  name: 'organizations',
})
@GUID({ prefix: 'org', len: 24 })
@Unique('idx_org_uniq_name', ['tenant', 'name'])
@Unique('idx_org_uniq_display_name', ['tenant', 'display_name'])
export class OrganizationEntity extends GuidIdentity {
  @Column({ unique: true, length: 32 })
  name: string;

  @Column({ length: 36 })
  tenant: string;

  @Column({ nullable: true, length: 32 })
  display_name: string;

  @OneToOne(() => BrandingEntity, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({
    name: 'fk_branding_id',
    referencedColumnName: 'id',
  })
  branding: BrandingEntity;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: any;

  @OneToMany(
    () => OrganizationEnabledConnectionEntity,
    (enabled_connection: OrganizationEnabledConnectionEntity) =>
      enabled_connection.organization,
    {
      eager: false,
    },
  )
  enabled_connections?: OrganizationEnabledConnectionEntity[];
}

@Entity({
  name: 'organization_members',
})
@Unique('idx_org_member_org_user_id', ['tenant', 'org_id', 'user_id'])
export class OrganizationMemberEntity extends GuidIdentity {
  @ManyToOne(() => OrganizationEntity, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
    referencedColumnName: 'id',
  })
  organization: OrganizationEntity;

  @Column({ length: 36 })
  tenant: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'fk_user_id',
    referencedColumnName: 'user_id',
  })
  @JoinColumn({
    name: 'tenant',
    referencedColumnName: 'tenant',
  })
  user: UserEntity;

  @Column({ length: 48 })
  org_id: string;

  // 如果叫 user_id, 会被typeorm构造 user的sql覆盖, 同名 user_id
  @Column({ name: 'fk_user_id', length: 80 })
  user_id: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  user_metadata: Record<string, any>;

  @OneToMany(
    () => OrganizationMemberRoleEntity,
    (memberRole: OrganizationMemberRoleEntity) => memberRole.member,
    {
      cascade: false,
      eager: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false,
    },
  )
  roles?: OrganizationMemberRoleEntity[];
}

@Entity({
  name: 'organization_member_roles',
})
export class OrganizationMemberRoleEntity extends BaseEntity {
  @Column({ length: 36 })
  tenant: string;

  // 因为 member 不是 eager 获取，并且此列为主键列，所以必须查询此字段
  @PrimaryColumn({ length: 48 })
  member_id: string;

  // 因为 role eager 获取，所以这里不需要重复查询此字段，否则 MySQL 会报重复列错误
  @PrimaryColumn({ select: false, length: 48 })
  role_id: string;

  @ManyToOne(
    () => OrganizationMemberEntity,
    (member: OrganizationMemberEntity) => member.roles,
    {
      eager: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: OrganizationMemberEntity;

  @ManyToOne(() => RoleEntity, {
    cascade: false,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
