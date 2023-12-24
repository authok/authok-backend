import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GUID, GuidIdentity } from '../../common/guid.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { ClientEntity } from '../client/client.entity';
import { ResourceServerEntity } from '../resource-server/resource-server.entity';

@Entity({
  name: 'client_grants',
})
@GUID({ prefix: 'cg' })
@Unique('idx_clientgrant_client_resource_server', [
  'tenant',
  'client_id',
  'audience',
])
export class ClientGrantEntity extends GuidIdentity {
  @Column({ length: 32 })
  client_id: string;

  @ManyToOne(() => ClientEntity, (client: ClientEntity) => client.grants, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'client_id',
  })
  client: ClientEntity;

  @Column({ length: 36 })
  tenant: string;

  @Column({ nullable: false, length: 36 })
  audience: string;

  @ManyToOne(() => ResourceServerEntity, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'audience',
    referencedColumnName: 'identifier',
  })
  @JoinColumn({
    name: 'tenant',
    referencedColumnName: 'tenant',
  })
  resource_server: ResourceServerEntity;

  @ManyToMany(() => PermissionEntity, {
    eager: true,
    cascade: false,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'client_grant_permissions',
    joinColumns: [{ name: 'client_grant_id' }],
    inverseJoinColumns: [{ name: 'permission_id' }],
  })
  permissions: PermissionEntity[];
}
