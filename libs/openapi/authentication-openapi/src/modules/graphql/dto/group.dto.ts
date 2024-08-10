import { Field } from '@nestjs/graphql';
import { NodeType, NodeInterface } from 'nestjs-relay';

@NodeType({ description: '组' })
export class Group extends NodeInterface {
  @Field({ nullable: true, description: '分组名称' })
  name?: string;

  @Field({
    name: 'created_at',
    nullable: false,
    description: '记录创建时间',
  })
  createdAt: Date;

  @Field({
    name: 'updated_at',
    nullable: true,
    description: '记录最后更新时间',
  })
  updatedAt?: Date;
}
