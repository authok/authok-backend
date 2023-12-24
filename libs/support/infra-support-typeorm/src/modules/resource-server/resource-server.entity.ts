import {
  Column,
  Entity,
  Unique,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { PermissionEntity } from '../permission/permission.entity';
import { GuidIdentity } from '../../common/guid.entity';

@Entity({
  name: 'resource_servers',
})
@Unique('idx_resource_server_identifier', ['tenant', 'identifier'])
export class ResourceServerEntity extends GuidIdentity {
  @Column({ length: 32 })
  name: string;

  @Column({ nullable: true, default: false })
  is_system: boolean;

  @Column({ nullable: true })
  token_dialect: string;

  @Column({ nullable: true, default: false })
  enforce_policies: boolean;

  @Column({ nullable: true })
  signing_secret: string;

  @Column({ length: 36 })
  tenant: string;

  @Column({ length: 36 })
  identifier: string;

  @Column({ nullable: true })
  allow_offline_access: boolean;

  @Column({ nullable: true })
  skip_consent_for_verifiable_first_party_clients: boolean;

  @Column({ nullable: true })
  token_lifetime: number;

  @Column({ nullable: true })
  token_lifetime_for_web: number;

  @Column({ nullable: true })
  signing_alg: string;

  @OneToMany(() => PermissionEntity, (permission) => permission.resource_server, {
    cascade: true,
    eager: true,
  })
  permissions?: PermissionEntity[];

  @DeleteDateColumn()
  @Exclude()
  dtime?: Date;
}
