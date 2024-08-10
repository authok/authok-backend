import { Field, ObjectType } from '@nestjs/graphql';
import { ConnectionConnection } from './connection.dto';

@ObjectType()
export class Application {
  @Field()
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  connections?: ConnectionConnection;
}
