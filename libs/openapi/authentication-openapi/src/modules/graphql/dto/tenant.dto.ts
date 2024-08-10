import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Tenant {
  @Field()
  logo?: string;

  @Field()
  name?: string;

  @Field()
  createdAt?: Date;

  @Field()
  // connections?: ConnectionConnection;
}
