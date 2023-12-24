import { Field } from '@nestjs/graphql';
import { NodeType, NodeInterface } from 'nestjs-relay';
import { ConnectionConnection } from './connection.dto';

@NodeType()
export class Tenant extends NodeInterface {
  @Field()
  logo?: string;

  @Field()
  name?: string;

  @Field()
  createdAt?: Date;

  @Field()
  connections?: ConnectionConnection;
}
