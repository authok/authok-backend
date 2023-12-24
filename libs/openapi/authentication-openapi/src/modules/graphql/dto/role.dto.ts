import { PageInfo, NodeType, NodeInterface } from 'nestjs-relay';
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

export class RoleEdge {
  @Field(() => String)
  readonly cursor!: string;

  @Field(() => Role)
  readonly node!: Role;
}

@ObjectType()
export class RoleConnection {
  @Field(() => PageInfo)
  readonly pageInfo!: PageInfo;

  @Field(() => [RoleEdge])
  readonly edges!: RoleEdge[];

  @Field(() => Int)
  readonly total!: number;
}
