import {
  Column,
  Entity,
} from 'typeorm';

import { GuidIdentity } from '@libs/support/infra-support-typeorm/common/guid.entity';

class JwtConfiguration {
  alg: string;
  lifetime_in_seconds: number;
  secret_encoded: boolean;
}

@Entity({
  name: 'tenants',
})
export class TenantEntity extends GuidIdentity {
  @Column({ type: 'simple-json', nullable: true })
  change_password?: any;

  @Column({ type: 'simple-json', nullable: true })
  device_flow?: any;

  @Column({ type: 'simple-json', nullable: true })
  guardian_mfa_page?: any;

  @Column({ type: 'text', nullable: true })
  default_audience?: string;

  @Column({ type: 'text', nullable: true })
  default_connection?: string;

  @Column({ type: 'simple-json', nullable: true })
  error_page?: any;

  @Column({ type: 'text', nullable: true })
  picture?: string;

  @Column({ type: 'text', nullable: true })
  support_email?: string;

  @Column({ type: 'text', nullable: true })
  support_url?: string;

  @Column({ type: 'text', nullable: true })
  allowed_logout_urls: string[];

  @Column({ type: 'int', nullable: true })
  session_lifetime: number;

  @Column({ type: 'int', nullable: true })
  idle_session_lifetime: number;

  @Column({ nullable: true })
  sandbox_version?: string;

  @Column({ nullable: true })
  default_redirection_uri: string;

  @Column({ type: 'simple-array', nullable: true })
  enabled_locales: string[];

  @Column({ type: 'simple-json', nullable: true })
  session_cookie: any;

  @Column({ unique: true, length: 32 })
  name: string;

  @Column({ unique: true, nullable: true, length: 32 })
  display_name: string;

  @Column({ length: 8 })
  region: string;

  @Column({ nullable: true })
  environment: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  flags?: Record<string, boolean>;

  @Column({
    type: 'simple-json',
  })
  jwt_configuration: JwtConfiguration;

  @Column({ type: 'simple-json', nullable: true })
  config: Record<string, any> = {};
}
