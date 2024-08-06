import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  ManyToMany,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { GUID, GuidIdentity } from '../../common/guid.entity';
import { UserEntity } from '../user/user.entity';
import { PermissionEntity } from '../permission/permission.entity';

@Entity({
  name: 'roles',
})
@Unique('idx_role_tenant_name', ['tenant', 'name'])
@GUID({ prefix: 'role' })
export class RoleEntity extends GuidIdentity {
  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
    length: 36,
  })
  public tenant: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 32,
  })
  public name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  public description: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    eager: false,
    onDelete: 'CASCADE',
  })
  permissions?: PermissionEntity[];
}

@Entity({
  name: 'user_roles',
})
@Unique('idx_user_role', ['tenant', 'user_id', 'role_id'])
export class UserRoleEntity extends GuidIdentity {
  @ManyToOne(() => RoleEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @PrimaryColumn({ length: 36 })
  tenant: string;

  @PrimaryColumn({ length: 80, name: 'fk_user_id' })
  user_id: string;

  @PrimaryColumn({ length: 48, name: 'fk_role_id' })
  role_id: string;

  @ManyToOne(() => UserEntity, { eager: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id', referencedColumnName: 'user_id' })
  @JoinColumn({ name: 'tenant', referencedColumnName: 'tenant' })
  user: UserEntity;
}
