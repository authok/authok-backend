import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({
  name: 'email_templates',
})
@Unique('idx_email_template_tenant', ['tenant', 'template'])
export class EmailTemplateEntity extends BaseEntity {
  @PrimaryColumn({ length: 32 })
  template: string;

  @PrimaryColumn({ length: 36 })
  tenant: string;

  @Column({ nullable: true })
  body: string;

  @Column()
  from: string;

  @Column({ nullable: true })
  result_url: string;

  @Column()
  subject: string;

  @Column()
  syntax: string;

  @Column({ default: 604800 })
  url_lifetime_in_seconds: number;

  @Column({ default: true })
  include_email_in_redirect: boolean;

  @Column({ default: true })
  enabled: boolean;
}
