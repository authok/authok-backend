import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'UserType' })
export class UserType {
  @Field({ nullable: true, description: '可读名称' })
  displayName?: string;

  @Field({ nullable: true, description: '名称' })
  name?: string;

  @Field({ nullable: true, description: 'description' })
  description?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: false, defaultValue: false })
  default?: boolean;

  @Field({ nullable: true })
  updatedBy?: string;
}
