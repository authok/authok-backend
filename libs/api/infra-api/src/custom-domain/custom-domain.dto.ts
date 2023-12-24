import { JoiSchema, JoiSchemaOptions } from "nestjs-joi";
import * as Joi from 'joi';
import { OmitType, PartialType, PickType } from "@nestjs/swagger";
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CustomDomainDto {
  id: string;

  domain: string; // "login.mycompany.com"

  primary: boolean;
  status: string; // "ready"
  type: string; // "self_managed_certs"
  origin_domain_name: string; // "mycompany_cd_0000000000000001.edge.tenants.authok.com"
  
  @JoiSchema(Joi.object({
    "methods": [
      "object"
    ]
  }))
  verification: Object;
  
  custom_client_ip_header: string;
  tls_policy: string; // recommended
}

export class CreateCustomDomainDto extends PartialType(OmitType(CustomDomainDto, [
  'id'
])) {};

export class UpdateCustomDomainDto extends PartialType(PickType(CreateCustomDomainDto, [
  'tls_policy',
  'custom_client_ip_header',
])) {};

@JoiSchemaOptions({
  allowUnknown: false
})
export class CustomDomainPageQueryDto extends PageQueryDto {
}