import { OmitType, PartialType, PickType } from "@nestjs/swagger";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

export class CustomDomainModel {
  id: string;
  domain: string; // "login.mycompany.com"
  primary: boolean;
  status: string; // "ready"
  type: string; // "self_managed_certs"
  origin_domain_name: string; // "mycompany_cd_0000000000000001.edge.tenants.authok.com"  
  verification: Object;
  custom_client_ip_header: string;
  tls_policy: string; // recommended
}

export class CreateCustomDomainModel extends PartialType(OmitType(CustomDomainModel, [
  'id'
])) {};

export class UpdateCustomDomainModel extends PartialType(PickType(CreateCustomDomainModel, [
  'tls_policy',
  'custom_client_ip_header',
])) {};

export interface CustomDomainPageQuery extends PageQuery {
}