import {
  InputType,
  Query,
  Resolver,
  Args,
  Parent,
  ResolveField,
  ArgsType,
} from '@nestjs/graphql';
import { User } from '../dto/user.dto';
import { Identity } from '../dto/identity.dto';
import {
  ConnectionArgs,
  ResolveConnectionField,
  Connection,
  GlobalIdFieldResolver,
} from 'nestjs-relay';
import { connectionFromArray } from 'graphql-relay';
import { Role, RoleConnection } from '../dto/role.dto';
import { IUserService } from 'libs/api/infra-api/src';
import { Inject } from '@nestjs/common';
@Resolver(() => User)
export class UserResolver extends GlobalIdFieldResolver(User) {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {
    super();
  }

  @Query(() => User)
  async user(@Args('id') id: string): Promise<User | null> {
    // const user = await this.userService.retrieve(id);
    // return { ...user, id: new ResolvedGlobalId({ type: 'User', user_id: user.user_id }) };
    return null;
  }

  @ResolveConnectionField(() => Role)
  roles(
    @Args() args: ConnectionArgs,
    @Args('namespace') namespace: string,
  ): RoleConnection {
    const conn: Connection<Role> = connectionFromArray<Role>([], args);
    return {
      total: 3,
      edges: [],
      pageInfo: {
        startCursor: '',
        endCursor: '',
        hasPreviousPage: false,
        hasNextPage: true,
      },
    };
  }

  @ResolveField(() => [Identity])
  async identities(@Parent() user: User): Promise<Identity[] | null> {
    console.log(user);
    return [];
  }
}
