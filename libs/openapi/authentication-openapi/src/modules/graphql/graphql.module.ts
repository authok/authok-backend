import { Module } from '@nestjs/common';
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
// import GraphQLJSON from 'graphql-type-json';
import { GlobalIdScalar } from 'nestjs-relay';
// import { DateScalar } from 'libs/shared/src/graphql/scalars/date.scalar';
import { NodeResolver } from './dto/node.resolver';
import { RoleResolver } from './resolvers/role.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      introspection: true,
      playground: true,
      debug: true,
      autoSchemaFile: join(process.cwd(), 'apps/api-server/schema.graphql'),
      /*uploads: {
        maxFieldSize: 10000000,
        maxFiles: 5,
      },*/
      // resolvers: [{ JSON: GraphQLJSON }],
      context: ({ req, res }) => {
        return {
          headers: req.headers,
          session: req.session,
          req: req,
          res: res,
          token: req.headers.token,
        };
      },
    } as GqlModuleOptions),
  ],
  providers: [
    UserResolver,
    RoleResolver,
    NodeResolver,
    // DateScalar,
    GlobalIdScalar,
  ],
})
export class GraphqlModule {}
