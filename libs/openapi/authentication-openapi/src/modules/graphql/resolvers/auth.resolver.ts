import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { IUserService } from 'libs/api/infra-api/src';
import { User } from '../dto/user.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(private userService: IUserService) {}

  @Mutation(() => User)
  async loginByPhoneCode(): // @Args('input', () => LoginByPhoneCodeInput) input: LoginByPhoneCodeInput,
  Promise<User | null> {
    return null;
  }
}
