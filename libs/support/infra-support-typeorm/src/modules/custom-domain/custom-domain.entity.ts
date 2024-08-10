import { Entity, Column } from "typeorm";
import { GuidIdentity } from "../../common/guid.entity";

@Entity({
  name: 'custom_domains'
})
export class CustomDomainEntity extends GuidIdentity {
  @Column({ length: 255 })
  domain: string; // "login.mycompany.com"

  @Column()
  primary: boolean;
  
  @Column({ length: 16 })
  status: string; // "ready"

  @Column({ length: 16 })
  type: string; // "self_managed_certs"

  @Column({ length: 255 })
  origin_domain_name: string; // "mycompany_cd_0000000000000001.edge.tenants.authok.com"
  
  @Column({ type: 'simple-json' })
  verification: Object;

  @Column({ length: 255 })
  custom_client_ip_header: string;

  @Column({ length: 64 })
  tls_policy: string; // recommended
}