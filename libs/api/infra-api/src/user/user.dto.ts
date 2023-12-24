import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { IdentityDto } from '../identity/identity.dto';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { RoleDto } from '../role/role.dto';
import { PermissionDto } from '../permission/permission.dto';
import { GroupDto } from '../group/group.dto';

export class UserDto {
  @ApiHideProperty()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({ description: '用户ID, 租户内唯一, 租户之间不唯一' })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: '创建用户的初始连接' })
  connection: string;

  @ApiProperty({
    description: '用户的全名. 英文例子: jim green, 中文: 李明',
    example: '李明',
  })
  @JoiSchema(Joi.string())
  name?: string;

  @ApiProperty({ example: 'fioman@qq.com', description: '邮箱' })
  @IsEmail()
  @JoiSchema(Joi.string())
  email?: string;

  @JoiSchema(Joi.string().allow(''))
  description: string;

  @ApiProperty({ example: true })
  @JoiSchema(Joi.boolean())
  email_verified?: boolean;

  @ApiProperty({ example: '+18300002222' })
  @IsMobilePhone()
  @JoiSchema(Joi.string())
  phone_number?: string;

  @ApiProperty({ example: '+86' })
  phone_country_code: string;

  @ApiProperty()
  @JoiSchema(Joi.boolean())
  phone_number_verified: boolean;

  @ApiProperty()
  logins_count?: number;

  @ApiProperty()
  @JoiSchema(Joi.boolean())
  blocked: boolean;

  @ApiProperty({ type: [IdentityDto] })
  identities: IdentityDto[];

  roles?: RoleDto[];

  groups?: GroupDto[];

  @ApiProperty()
  @JoiSchema(Joi.object())
  user_metadata?: Record<string, any>;

  @ApiProperty()
  @JoiSchema(Joi.object())
  app_metadata?: Record<string, any>;

  @ApiProperty({
    description: '注册时间',
  })
  signup_at: Date;

  @ApiProperty({
    description: '最后更新时间',
  })
  updated_at: Date;

  @ApiProperty({
    description: '用户创建时间',
  })
  created_at: Date;

  @ApiProperty({
    example: 'tom',
    description: '用户名. 如果数据源设置需要用户名登录, 则此字段有效.',
  })
  @JoiSchema(Joi.string())
  username: string;

  @ApiProperty({ description: '昵称', example: '吃代码的猫' })
  @JoiSchema(Joi.string())
  nickname: string;

  @ApiProperty({ example: 'jim' })
  @JoiSchema(Joi.string())
  given_name?: string;

  @ApiProperty({ example: 'green' })
  @JoiSchema(Joi.string())
  family_name?: string;

  @ApiProperty({ description: '头像照片url', example: '' })
  @JoiSchema(Joi.string().allow(''))
  picture?: string;

  @ApiHideProperty()
  tenant: string;

  @ApiProperty({
    description:
      'Whether the user will receive a verification email after creation (true) or no email (false). Overrides behavior of email_verified parameter.',
  })
  @JoiSchema(Joi.boolean())
  verify_email: boolean;

  @ApiProperty({ description: '性别. 0. 未知, 1. 男, 2. 女', example: 0 })
  @JoiSchema(Joi.number())
  gender: number;

  @ApiProperty({
    description: '生日，为了兼容数据来源，这里采用字符串形式',
    example: '1987-12-32',
  })
  @JoiSchema(Joi.string())
  birthdate: string;

  @ApiProperty({ example: 'zh', description: '本地化用途' })
  @JoiSchema(Joi.string())
  locale: string;

  @ApiProperty({ example: '中国' })
  @JoiSchema(Joi.string())
  country: string;

  @ApiProperty({ example: '深圳' })
  @JoiSchema(Joi.string())
  city: string;

  @ApiProperty({ example: '广东' })
  @JoiSchema(Joi.string())
  province: string;

  @ApiProperty({ example: '南山区', description: '地区' })
  @JoiSchema(Joi.string())
  region: string;

  @ApiProperty({ example: '粤海街道某楼' })
  @JoiSchema(Joi.string())
  address: string;

  @ApiProperty({ description: '邮政编码', example: '518000' })
  @JoiSchema(Joi.string())
  postal_code: string;

  @ApiHideProperty()
  @JoiSchema(Joi.string())
  password: string;

  @ApiProperty({
    description: '注册来源IP地址',
    example: '23.223.33.21',
  })
  signup_ip?: string;

  @ApiProperty({
    description: '最后登录时间',
  })
  last_login: Date;

  @ApiProperty({
    description: '最后登录IP',
  })
  last_ip?: string;

  // @ApiProperty()
  @ApiHideProperty()
  secret2fa: string;

  @ApiHideProperty()
  //@ApiProperty({ description: '' })
  enabled2fa: boolean;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateUserDto extends OmitType(UserDto, [
  'id',
  'connection',
  'user_id',
  'roles',
  'groups',
  'updated_at',
  'signup_at',
  'signup_ip',
  'last_ip',
  'last_login',
  'logins_count',
  'tenant',
  'last_ip',
  'identities',
  'phone_country_code',
]) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateUserDto {
  @ApiHideProperty()
  user_id?: string;

  @ApiProperty({ required: true, description: '用户的主身份源' })
  @JoiSchema(
    Joi.string()
      .messages({ 'any.required': 'conection 为必填字段' })
      .required(),
  )
  readonly connection: string;

  @ApiPropertyOptional({
    description: '邮箱, 可用于 邮箱/密码登录',
    example: 'fioman@qq.com',
  })
  @JoiSchema(Joi.string().email({ tlds: false }))
  readonly email?: string;

  @ApiPropertyOptional({
    description: '手机号, 可用于 手机号/密码登录',
    example: '+18300002222',
  })
  @IsMobilePhone()
  @JoiSchema(Joi.string())
  readonly phone_number?: string;

  @ApiPropertyOptional({
    description: '用户名, 可用于 用户名/密码登录',
    example: 'tom',
  })
  @JoiSchema(Joi.string())
  readonly username?: string;

  @ApiPropertyOptional({ description: '头像url', example: '' })
  @JoiSchema(Joi.string().allow(''))
  picture?: string;

  @ApiPropertyOptional({
    description: '性别. 0. 未知, 1. 男, 2. 女',
    example: 0,
  })
  @JoiSchema(Joi.number())
  gender?: number;

  @ApiPropertyOptional({
    default: false,
    example: false,
    description: '强制新用户登录前修改密码',
  })
  @JoiSchema(Joi.boolean())
  force_reset_password?: boolean;

  @ApiPropertyOptional({ description: '昵称', example: '吃代码的猫' })
  @JoiSchema(Joi.string())
  readonly nickname?: string;

  @ApiPropertyOptional({
    description: '用户的全名. 英文例子: jim green, 中文: 李明',
    example: '李明',
  })
  @JoiSchema(Joi.string())
  readonly name?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: '手机号是否验证',
  })
  @JoiSchema(Joi.boolean())
  readonly phone_number_verified?: boolean;

  @ApiPropertyOptional({ example: 'jim' })
  @JoiSchema(Joi.string().allow(''))
  readonly given_name?: string;

  @ApiPropertyOptional({ example: 'green' })
  @JoiSchema(Joi.string().allow(''))
  readonly family_name?: string;

  @ApiProperty({ required: true, description: '密码' })
  @JoiSchema(Joi.string().required())
  readonly password?: string;

  @ApiPropertyOptional({
    description:
      'Whether the user will receive a verification email after creation (true) or no email (false). Overrides behavior of email_verified parameter.',
  })
  @JoiSchema(Joi.boolean().default(false))
  verify_email?: boolean = false;

  @ApiPropertyOptional({ example: true })
  @JoiSchema(Joi.boolean().default(false))
  email_verified?: boolean = false;

  @ApiPropertyOptional({})
  @JoiSchema(Joi.object())
  readonly user_metadata?: Record<string, any>;

  @ApiPropertyOptional({})
  @JoiSchema(Joi.object())
  readonly app_metadata?: Record<string, any>;

  @ApiPropertyOptional({
    example: false,
    description: '用户是否被锁定，锁定后不可登录',
  })
  @JoiSchema(Joi.boolean())
  readonly blocked?: boolean;

  @ApiHideProperty()
  readonly signup_ip?: string;

  @ApiHideProperty()
  readonly signup_at?: Date;

  @ApiHideProperty()
  last_login?: Date;

  @ApiHideProperty()
  readonly last_ip?: string;

  @ApiHideProperty()
  readonly identities?: IdentityDto[];
}

@JoiSchemaOptions({})
export class UserPageQueryDto extends PageQueryDto {
  @ApiProperty({ required: false, description: '身份源唯一标识符' })
  @JoiSchema(Joi.string())
  connection?: string;

  @ApiProperty({ required: false, description: '角色ID' })
  @JoiSchema(Joi.string())
  role_id?: string;
}

class PostPermission extends PickType(PermissionDto, [
  'resource_server_identifier',
  'permission_name',
]) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PostPermissionsDto {
  @JoiSchema(
    Joi.array()
      .items(
        Joi.object({
          resource_server_identifier: Joi.string().required(),
          permission_name: Joi.string().required(),
        }),
      )
      .required(),
  )
  @ApiProperty({
    type: [PostPermission],
  })
  permissions: PostPermission[];
}

export class RecoveryCodeRegenerationDto {
  @ApiProperty()
  readonly recovery_code: string;
}
