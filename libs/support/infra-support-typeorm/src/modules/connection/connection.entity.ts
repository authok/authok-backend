import {
  Column,
  Entity,
  Unique,
  ManyToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { ClientEntity } from '../client/client.entity';
import { GuidIdentity, GUID } from '../../common/guid.entity';
class LinkConfigure {
  support: string;
  termsOfService: string;
  privacyPolicy: string;
}

@Entity({
  name: 'connections',
})
@Unique('idx_connection_name', ['tenant', 'name'])
@GUID({ prefix: 'con', len: 16})
export class ConnectionEntity extends GuidIdentity {
  @Column({ nullable: false, length: 32 })
  name: string;

  @Column({ nullable: true, length: 32 })
  display_name: string;

  @Column({ nullable: true, length: 36 })
  tenant: string;

  @Column({ nullable: true, type: 'simple-array' })
  realms: string[];

  @Column({ nullable: true, length: 32 })
  creator: string;

  // 这个字段貌似没用
  @Column({ nullable: true, length: 32 })
  type: string;

  @Column({ nullable: true, length: 32 })
  strategy: string;

  @Column({ nullable: true, length: 32 })
  strategy_type: string;

  @Column({ nullable: true, length: 256 })
  icon: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  options: Record<string, any>;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  metadata: Record<string, any>;

  @ManyToMany(() => ClientEntity, (client: ClientEntity) => client.enabled_connections, {
    onDelete: 'CASCADE',
    eager: true,
  })
  enabled_clients?: ClientEntity[];

  @Column({ nullable: true, default: false })
  is_domain_connection: boolean;
}
