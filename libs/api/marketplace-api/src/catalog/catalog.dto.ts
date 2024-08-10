import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';
import { FeactureDto } from "../feature/feature.dto";

export class CatalogDto {
  id: string;
  catalog_id: string; // "apple"
  categories: string[]; // ["Social Login"]
  creator: string;
  // docs: {skipSections: [2, 5], apiUrl: "https://auth0.com/docs/meta/snippets/social/apple",…}
  feature_id: string;
  feature: FeactureDto;
  // gallery: any[];
  icon: string;
  // links: {partnerWebsiteText: "Sign in with Apple",…}
  metaDescription: string; // "Apple - The easy way to add Sign in with Apple to your app or website"
  metaTitle: string; //"Apple Integration with Auth0"
  name: string; //"Apple"
  rank: number; // 150
  readme: string; //"https://cdn.authok.io/marketplace/catalog/content/readme/social-connections/apple.json"
  shortDescription: string; // "The easy way to add Sign in with Apple to your app or website"
  supportLevel: string; // "supported"
  type: string; // "built-in"
  slug: string; // "wechat-qr-social-connection"
  creationUri: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CatalogPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  catalog_id: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())))  
  category: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())))  
  feature: string | string[];
}