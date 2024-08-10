import { Query, Resolver, Args, Parent, ResolveField } from '@nestjs/graphql';
import { Role } from '../dto/role.dto';

@Resolver(() => Role)
export class RoleResolver {
  @Query(() => Role)
  async role(@Args('id') id: string): Promise<Role | null> {
    return new Role();
  }
}
