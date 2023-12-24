import { Field } from '@nestjs/graphql';
import { NodeType, NodeInterface } from 'nestjs-relay';
import { ConnectionConnection } from './connection.dto';

@NodeType()
export class Application extends NodeInterface {
  @Field()
  createdAt?: Date;

  @Field()
  connections?: ConnectionConnection;
}
