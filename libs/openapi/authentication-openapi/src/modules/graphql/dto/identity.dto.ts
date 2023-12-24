import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Identity {
  @Field()
  openid: string;

  @Field()
  userIdInIdp: string;

  @Field()
  userId: string;

  @Field()
  connection: string;

  @Field()
  isSocial: boolean;

  @Field()
  provider?: string;

  @Field()
  refreshToken: string;

  @Field()
  accessToken: string;

  // @Field(()=>JSON)
  // profileData: Record<string, any>;
}
