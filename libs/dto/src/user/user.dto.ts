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
import { PageDto, PageQueryDto, StartLimitPageDto } from 'libs/common/src/pagination/pagination.dto';
import { RoleDto } from '../role/role.dto';
import { PermissionDto } from '../permission/permission.dto';
import { GroupDto } from '../group/group.dto';
import { OrganizationDto } from '../organization';

export class UserDto {
  @ApiHideProperty()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({ description: 'User ID, Unique for Tenant, not unique between Tenants.' })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'initial connection' })
  connection: string;

  @ApiProperty({
    description: 'fullname. e.g.: jim green, 李明',
    example: '李明',
  })
  @JoiSchema(Joi.string())
  name?: string;

  @ApiProperty({ example: 'ai@gmail.com', description: 'Email' })
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

  @ApiProperty({ example: '+1' })
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
    description: 'Username. 如果数据源设置需要用户名登录, 则此字段有效.',
  })
  @JoiSchema(Joi.string())
  username: string;

  @ApiProperty({ description: 'Nickname', example: 'Bob' })
  @JoiSchema(Joi.string())
  nickname: string;

  @ApiProperty({ example: 'jim' })
  @JoiSchema(Joi.string())
  given_name?: string;

  @ApiProperty({ example: 'green' })
  @JoiSchema(Joi.string())
  family_name?: string;

  @ApiProperty({ description: 'Picture', example: '' })
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
  @ApiProperty({ description: 'User ID, Unique for tenant, not unique betwen tenants' })
  @JoiSchema(
    Joi.string()
  )
  user_id?: string;

  @ApiProperty({ required: true, description: 'initial connection' })
  @JoiSchema(
    Joi.string()
      .messages({ 'any.required': 'connection required' })
      .required(),
  )
  readonly connection: string;

  @ApiPropertyOptional({
    description: 'Email, For email / password login',
    example: 'ai@gmail.com',
  })
  @JoiSchema(Joi.string().email({ tlds: false }))
  readonly email?: string;

  @ApiPropertyOptional({
    description: 'Phone number, For phone / password login',
    example: '+100002222',
  })
  @IsMobilePhone()
  @JoiSchema(Joi.string())
  readonly phone_number?: string;

  @ApiPropertyOptional({
    description: 'Username, For username / password login',
    example: 'tom',
  })
  @JoiSchema(Joi.string())
  readonly username?: string;

  @ApiPropertyOptional({ description: 'Picture', example: '' })
  @JoiSchema(Joi.string().allow(''))
  picture?: string;

  @ApiPropertyOptional({
    description: 'gender. 0. unknwon, 1. male, 2. female',
    example: 0,
  })
  @JoiSchema(Joi.number())
  gender?: number;

  @ApiPropertyOptional({
    default: false,
    example: false,
    description: 'Force reset password',
  })
  @JoiSchema(Joi.boolean())
  force_reset_password?: boolean;

  @ApiPropertyOptional({ description: 'Email', example: 'Bob' })
  @JoiSchema(Joi.string())
  readonly nickname?: string;

  @ApiPropertyOptional({
    description: 'Fullname. e.g.: jim green, 中文: 李明',
    example: '李明',
  })
  @JoiSchema(Joi.string())
  readonly name?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Is Phone number verified',
  })
  @JoiSchema(Joi.boolean())
  readonly phone_number_verified?: boolean;

  @ApiPropertyOptional({ example: 'jim' })
  @JoiSchema(Joi.string().allow(''))
  readonly given_name?: string;

  @ApiPropertyOptional({ example: 'green' })
  @JoiSchema(Joi.string().allow(''))
  readonly family_name?: string;

  @ApiPropertyOptional({ description: 'password' })
  @JoiSchema(Joi.string())
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
    description: `User can't login if blocked`,
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
  @ApiProperty({ required: false, description: 'Connection' })
  @JoiSchema(Joi.string())
  connection?: string;

  @ApiProperty({ required: false, description: 'Role ID' })
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


export class OrganizationPageDto extends StartLimitPageDto {
  @ApiProperty()
  organizations: Array<OrganizationDto>;
}
