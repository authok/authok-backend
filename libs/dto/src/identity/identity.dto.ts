import {
    ApiProperty,
    ApiPropertyOptional,
    OmitType,
    PartialType,
  } from '@nestjs/swagger';
  import { JoiSchemaOptions } from 'nestjs-joi';
  import * as Joi from 'joi';
  
  @JoiSchemaOptions({})
  export class ProfileDataDto {
    user_id: string;
  
    @ApiPropertyOptional()
    email: string;
  
    @ApiPropertyOptional()
    emailVerified: boolean;
  
    @ApiPropertyOptional()
    name: string;
  
    @ApiPropertyOptional()
    username: string;
  
    @ApiPropertyOptional()
    given_name: string;
  
    @ApiPropertyOptional()
    phone_number: string;
  
    @ApiPropertyOptional()
    phone_number_verified: boolean;
  
    @ApiPropertyOptional()
    family_name: string;
  
    @ApiPropertyOptional()
    picture: string;
  
    @ApiPropertyOptional()
    city: string;
  
    @ApiPropertyOptional()
    province: string;
  
    @ApiPropertyOptional()
    country: string;
  
    @ApiPropertyOptional()
    gender: number;
  
    @ApiPropertyOptional()
    nickname: string;
  
    @ApiPropertyOptional()
    openid: string;
  
    @ApiPropertyOptional()
    unionid: string;
  
    [key: string]: any;
  }
  
  export class IdentityDto {
    id: string;
  
    @ApiProperty()
    connection: string;
  
    @ApiProperty()
    user_id: string;
  
    @ApiProperty()
    provider: string;
  
    @ApiProperty({ name: 'is_social' })
    readonly is_social: boolean;
  
    @ApiPropertyOptional()
    readonly access_token?: string;
  
    @ApiPropertyOptional()
    readonly expires_in: number;
  
    @ApiPropertyOptional()
    readonly refresh_token?: string;
  
    @ApiProperty()
    readonly profile_data?: ProfileDataDto;
  
    last_login: Date;
  
    updated_at: Date;
  
    created_at: Date;
  }
  
  @JoiSchemaOptions({
    allowUnknown: false,
  })
  export class LinkIdentityReq {
    @ApiProperty({
      description: '被关联账户的身份提供者.',
    })
    readonly provider?: string;
  
    @ApiProperty({
      description:
        '如果有多个 authok 数据库 connection 存在, 这里为被关联账户的 connection.',
    })
    readonly connection?: string;
  
    @ApiProperty()
    readonly user_id?: string;
  
    @ApiProperty({
      description:
        '这里为被关联账户的 JWT. 如果填写了此参数, provider, user_id, 和 connection_id 就不需要填写.',
    })
    readonly link_with?: string;
  }
  
  export class CreateIdentityDto extends OmitType(IdentityDto, [
    'id',
    'provider',
    'last_login',
    'updated_at',
    'created_at',
    'profile_data',
  ]) {
    @ApiProperty()
    readonly profile_data: Partial<ProfileDataDto>;
  }
  