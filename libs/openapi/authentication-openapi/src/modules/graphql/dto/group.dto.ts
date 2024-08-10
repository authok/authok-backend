import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Group' })
export class Group {
  @Field()
  id: string;
  
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
