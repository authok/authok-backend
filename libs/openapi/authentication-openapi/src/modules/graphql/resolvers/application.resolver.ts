import { Args, Query, Resolver } from '@nestjs/graphql';
import { Application } from '../dto/application.dto';
import { GlobalIdFieldResolver } from 'nestjs-relay';

@Resolver(Application)
// @UseGuards(PoliciesGuard)
export class ApplicationResolver extends GlobalIdFieldResolver(Application) {
  constructor() {
    super();
  }

  @Query(() => Application, {
    nullable: true,
    description: '获取应用',
  })
  async application(@Args('id') id: string): Promise<Application | null> {
    return null;
    /*
    return {
      // id: new ResolvedGlobalId({ type: 'Application', id }),
      id: '1',
    };*/
  }

  /*
  @ResolveConnectionField(() => Connection)
  async connections(
    @Args() args: ConnectionArgs,
    @Parent() parent: Application,
  ): Promise<ConnectionConnection> {
    return {
      edges: [],
      total: 3,
      pageInfo: {
        startCursor: '1',
        endCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
      },
    };
  }
  */
}
