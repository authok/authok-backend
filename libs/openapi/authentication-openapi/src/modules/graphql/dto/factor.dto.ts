import { Field, ObjectType } from '@nestjs/graphql';
import { NodeInterface } from 'nestjs-relay';

@ObjectType()
export class Factor extends NodeInterface {
  @Field({ nullable: true, description: '' })
  factorType?: string;

  @Field({ nullable: true, description: '' })
  provider?: string;

  @Field({ nullable: true, description: '' })
  vendorName?: string;

  @Field({ nullable: true, description: '' })
  status?: string;

  @Field({ nullable: true, description: '' })
  profile?: Record<string, any>;

  @Field({ name: 'created_at', nullable: true, description: '创建时间' })
  createdAt?: Date;

  @Field({ name: 'updated_at', nullable: true, description: '最后更新时间' })
  updatedAt?: Date;
}
