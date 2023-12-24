import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  BaseEntity,
  BeforeInsert,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm/index';

import { Exclude } from 'class-transformer';
import { nanoid } from 'nanoid';
import { ConnectionEntity } from '../connection/connection.entity';
import { ClientGrantEntity } from '../client-grant/client-grant.entity';

@Entity({
  name: 'clients',
})
@Unique('idx_client_tenant_name', ['tenant', 'name'])
@Unique('idx_client_tenant_client_id', ['tenant', 'client_id'])
export class ClientEntity extends BaseEntity {
  @PrimaryColumn({ length: 32 })
  public client_id: string;

  @BeforeInsert()
  private generateGuid(): void {
    if (this.client_id === undefined) {
      this.client_id = nanoid(32);
    }
  }

  @Column({ length: 32 })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true, length: 32 })
  app_type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 36 })
  tenant: string;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public client_secret: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  public grant_types: string[];

  @Column({ type: 'simple-array', nullable: true })
  public redirect_uris: string[];

  @Column({ type: 'simple-array', nullable: true })
  response_types: string[];

  @Column({ nullable: true })
  token_endpoint_auth_method: string;

  @Column({ nullable: true })
  logo_uri: string;

  @Column({ type: 'simple-array', nullable: true })
  web_origins: string[];

  @Column({ type: 'simple-array', nullable: true })
  allowed_origins: string[];

  @Column({ type: 'simple-array', nullable: true })
  client_aliases: string[];

  @Column({ type: 'simple-array', nullable: true })
  allowed_clients: string[];

  @Column({ type: 'simple-array', nullable: true })
  allowed_logout_urls: string[];

  @Column({ type: 'simple-json', nullable: true })
  jwt_configuration: any;

  @Column({ type: 'simple-json', nullable: true })
  encryption_key: any;

  @Column({ type: 'text', nullable: true })
  form_template: string;

  @Column({ type: 'simple-json', nullable: true })
  client_metadata: Record<string, any>;

  @Column({ default: false, nullable: true })
  is_first_party: boolean;

  @Column({ nullable: true })
  initiate_login_uri: string;

  @Column({ default: false, nullable: true })
  oidc_conformant: boolean;

  @Column({ type: 'simple-json', nullable: true })
  refresh_token: any;

  @Column({ type: 'simple-json', nullable: true })
  native_social_login: any;

  @Column({ nullable: true })
  organization_usage: string;

  @Column({ nullable: true })
  organization_require_behavior: string;

  @Column({ type: 'simple-json', nullable: true })
  addons: any;

  @Column({ type: 'simple-json', nullable: true })
  mobile: any;

  @Column({ default: false, nullable: true })
  cross_origin_auth: boolean;

  @Column({ nullable: true })
  cross_origin_loc: string;

  @Column({ default: true, nullable: true })
  sso: boolean;

  @Column({ default: false, nullable: true })
  sso_disabled: boolean;

  @Column({ default: false, nullable: true })
  custom_login_page_on: boolean;

  @Column({ nullable: true })
  custom_login_page_preview: string;

  @Column({ nullable: true })
  custom_login_page: string;

  @DeleteDateColumn()
  dtime: Date;

  //------------------------------ oidc-provider-client
  @Column({ default: 'RS256' })
  id_token_signed_response_alg: string;

  @Column({ default: false })
  require_auth_time: boolean;

  @Column({ nullable: true })
  subject_type: string;

  @Column({ nullable: true })
  revocation_endpoint_auth_method: string;

  @Column({ default: false })
  require_signed_request_object: boolean;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  request_uris: string[];

  @ManyToMany(
    () => ConnectionEntity,
    (connection) => connection.enabled_clients,
    {
      onDelete: 'CASCADE',
      eager: false,
    },
  )
  @JoinTable({
    name: 'client_connections',
    joinColumns: [
      {
        name: 'client_id',
        referencedColumnName: 'client_id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'connection_id',
        referencedColumnName: 'id',
      },
    ],
  })
  enabled_connections?: ConnectionEntity[];

  @OneToMany(
    () => ClientGrantEntity,
    (clientGrant: ClientGrantEntity) => clientGrant.client,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  grants?: ClientGrantEntity[];
}
