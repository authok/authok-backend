import { Field } from '@nestjs/graphql';
import { NodeType, NodeInterface } from 'nestjs-relay';

@NodeType({ description: '模板' })
export class UserType extends NodeInterface {
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
