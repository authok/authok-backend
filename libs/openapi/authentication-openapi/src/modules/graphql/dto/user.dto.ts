import { Field } from '@nestjs/graphql';
import { NodeType, NodeInterface } from 'nestjs-relay';
import { Address } from './address.dto';
import { Gender } from './gender.dto';

@NodeType({ description: '用户资料' })
export class User extends NodeInterface {
  @Field({ nullable: true, description: '姓名，例：Jane Josephine Doe' })
  name?: string;

  @Field({ name: 'given_name', nullable: true, description: '名，例：Jane' })
  givenName?: string;

  @Field({ name: 'family_name', nullable: true, description: '姓，例：Doe' })
  familyName?: string;

  @Field({
    name: 'middle_name',
    nullable: true,
    description: '中间名，例：Josephine',
  })
  middleName?: string;

  @Field({ nullable: true, description: '昵称，例：JJ' })
  nickname?: string;

  @Field({
    nullable: true,
    description: '个人资料，例：http://exampleco.com/janedoe',
  })
  profile?: string;

  @Field({
    nullable: true,
    description: '头像，例：http://exampleco.com/janedoe/me.jpg',
  })
  picture?: string;

  @Field({ nullable: true, description: '个人主页，例：http://exampleco.com' })
  website?: string;

  @Field({ nullable: true, description: '工作单位，例：google' })
  company?: string;

  @Field({ nullable: true, description: '邮箱，例：janedoe@exampleco.com' })
  email?: string;

  @Field({
    name: 'email_verified',
    nullable: true,
    description: '邮箱是否验证成功',
    defaultValue: false,
  })
  emailVerified?: boolean;

  @Field(() => Gender, { nullable: true, description: '性别' })
  gender?: Gender;

  @Field({ nullable: true, description: '生日，例：1972-03-31' })
  birthdate?: Date;

  @Field({ nullable: true, description: '时区，例：America/Los_Angeles' })
  zoneinfo?: string;

  @Field({ nullable: true, description: '语言，例：en-US' })
  locale?: string;

  @Field({
    name: 'phone_number',
    nullable: true,
    description: '手机号，例：+1 (111) 222-3434',
  })
  phoneNumber?: string;

  @Field({
    name: 'phone_number_verified',
    nullable: true,
    description: '手机号是否验证成功',
    defaultValue: false,
  })
  phoneNumberVerified?: boolean;

  @Field(() => Address, { nullable: true, description: '地址' })
  address?: Address;

  @Field({ nullable: true, description: '是否封禁', defaultValue: false })
  blocked?: boolean;

  @Field({
    name: 'logins_count',
    nullable: false,
    description: '登录总次数',
    defaultValue: 0,
  })
  loginsCount: number;

  @Field({ name: 'last_login_at', nullable: true, description: '最近登录时间' })
  lastLoginAt?: Date;

  @Field({ name: 'last_login_ip', nullable: true, description: '最近登录IP' })
  lastLoginIp?: string;

  @Field({
    name: 'signup_source',
    nullable: true,
    description: '注册来源，例：weibo',
  })
  signupSource?: string;

  @Field({ name: 'signup_at', nullable: true, description: '用户注册时间' })
  signupAt?: Date;

  @Field({
    name: 'created_at',
    nullable: false,
    description: '用户记录保存时间',
  })
  createdAt: Date;

  @Field({
    name: 'updated_at',
    nullable: true,
    description: '用记录最后更新时间',
  })
  updatedAt?: Date;
}
