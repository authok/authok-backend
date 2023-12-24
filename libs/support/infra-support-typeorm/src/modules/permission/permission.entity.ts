import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ResourceServerEntity } from '../resource-server/resource-server.entity';
import { RoleEntity } from '../role/role.entity';
import { GuidIdentity } from '../../common/guid.entity';

@Entity({
  name: 'permissions',
})
@Unique('idx_permission_resource_server', ['resource_server_id', 'name'])
export class PermissionEntity extends GuidIdentity {
  @Column()
  description: string;

  @Column({ length: 36 })
  name: string;

  @Column({ length: 48 })
  resource_server_id: string;

  @ManyToMany(() => RoleEntity, (role: RoleEntity) => role.permissions, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumns: [{ name: 'permission_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'role_id' }],
  })
  roles?: RoleEntity[];

  @ManyToOne(() => ResourceServerEntity, (resourceServer) => resourceServer.permissions, {
    cascade: false,
    eager: false,
    orphanedRowAction: 'delete',
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'resource_server_id',
    referencedColumnName: 'id',
  })
  resource_server?: ResourceServerEntity;
}
