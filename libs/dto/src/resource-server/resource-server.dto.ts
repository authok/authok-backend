import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { JoiSchemaOptions, JoiSchema, CREATE, UPDATE } from 'nestjs-joi';
import * as Joi from 'joi';
import { ClientDto } from '../client';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ResourceServerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @JoiSchema([UPDATE], Joi.string().optional().required())
  @JoiSchema([CREATE], Joi.string().optional().required())
  name: string;

  @ApiProperty({
    required: true,
    description: 'API的唯一标识, 用于授权调用的 audience 参数',
  })
  @JoiSchema([CREATE], Joi.string()
      .required()
      .description('一旦设置不可更改')
      .error(new Error('identifier必须设置, 且不可更改')),
  )
  identifier: string;

  @ApiProperty({
    required: false,
    description: '系统API或自定义API',
  })
  @JoiSchema(Joi.boolean())
  is_system: boolean;

  @ApiProperty({
    nullable: true,
    description: 'API使用到的权限',
  })
  @JoiSchema(
    Joi.array().items(
      Joi.object({
        description: Joi.string(),
        value: Joi.string(),
      }),
    ),
  )
  scopes: { description: string; value: string }[];

  @ApiProperty({
    description: 'JWTs 签名用到的算法. HS256 或 RS256.'
  })
  @JoiSchema(Joi.string())
  signing_alg: string;

  @ApiProperty({
    description: '使用 对称算法(HS256) 进行 token 签名的 Secret.'
  })
  @JoiSchema(Joi.string())
  signing_secret: string;

  @ApiProperty({
    required: false,
    description: '是否可以为此API颁发刷新令牌（true）或（false).',
    default: false,
  })
  @JoiSchema(Joi.boolean().default(false))
  allow_offline_access: boolean;

  @ApiProperty({ default: false, description: '标记为第一方（true）或非第一方（false）的应用程序，决定是否跳过用户授权流程.' })
  @JoiSchema(Joi.boolean().default(false))
  skip_consent_for_verifiable_first_party_clients: boolean;

  @ApiProperty({ default: 86400, description: '从令牌端点为此API颁发的访问令牌的过期值(秒).' })
  @JoiSchema(Joi.number().default(86400))
  token_lifetime: number;

  @ApiProperty({ required: false, description: '通过隐式流或混合流为此API颁发的访问令牌的过期值(秒). 不能大于令牌的生存期值.' })
  @JoiSchema(Joi.number())
  token_lifetime_for_web: number;

  @ApiProperty({ default: false, description: '是否开启rbac策略，开启后，权限都会写入访问令牌.' })
  @JoiSchema(Joi.boolean().default(false))
  enforce_policies: boolean;

  @ApiProperty({ required: false, description: '访问令牌的方言。可以是 access token 或 access token authz.' })
  @JoiSchema(Joi.string())
  token_dialect: string;

  @ApiProperty()
  client: Partial<ClientDto>;
}

@JoiSchemaOptions({})
export class CreateResourceServerDto extends PartialType(OmitType(ResourceServerDto, [
  'id',
  'client',
])) {}

export class UpdateResourceServerDto extends PartialType(OmitType(CreateResourceServerDto, [
  'identifier',
])) {}


@JoiSchemaOptions({
  allowUnknown: false,
})
export class ResourceServerPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.boolean())
  is_system?: boolean;

  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  id?: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  identifier?: string | string[];

  @JoiSchema(Joi.boolean())
  enforce_policies?: boolean;
}
