import { Query, Resolver, Args, Parent, ResolveField } from '@nestjs/graphql';
import { User } from '../dto/user.dto';
import { Role, RoleConnection } from '../dto/role.dto';

@Resolver(() => Role)
export class RoleResolver {
  @Query(() => Role)
  async role(@Args('id') id: string): Promise<Role | null> {
    return new Role();
  }
}
