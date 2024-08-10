import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@NodeType()
export class Role extends NodeInterface {
  @Field()
  namespace: string;
  @Field()
  code: string;
  @Field()
  arn: string;
  @Field()
  description: string;
  @Field()
  isSystem: boolean;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
  @Field()
  parent: Role;
}