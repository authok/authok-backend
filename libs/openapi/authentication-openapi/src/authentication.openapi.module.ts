import { Module, Global } from '@nestjs/common';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { RestfulAuthenticationOpenApiModule } from './modules/restful/restful.authentication.openapi.module';

@Global()
@Module({
  imports: [
    RestfulAuthenticationOpenApiModule, 
    // GraphqlModule,
  ],
})
export class AuthenticationOpenApiModule {}
