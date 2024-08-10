import {
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import {
  AuthenticationHandler,
  ICredentials,
  IPrincipal,
} from 'libs/api/authentication-api/src';
import { 
  IUserService,
  IConnectionService,
  IdentityModel,
} from 'libs/api/infra-api/src';
import { PasswordlessCredentials } from './credentials';
import { IPasswordlessTokenRepository } from './passwordless-token.repository';
import { IRequestContext } from '@libs/nest-core';
import { APIException } from 'libs/common/src/exception/api.exception';
import { nanoid } from 'nanoid';

@Injectable()
export class PasswordlessTokenAuthenticationHandler extends AuthenticationHandler {
  constructor(
    @Inject('IPasswordlessTokenRepository')
    private readonly passwordlessTokenRepository: IPasswordlessTokenRepository,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
  ) {
    super();
  }

  async doAuthenticate(
    ctx: IRequestContext,
    _credentials: ICredentials,
  ): Promise<IPrincipal> {
    console.log(
      'PasswordlessTokenAuthenticationHandler::doAuthenticate',
      _credentials,
    );
    const credentials = _credentials as PasswordlessCredentials;

    const connection = await this.connectionService.findByName(ctx, credentials.connection);
    if (!connection) {
      throw new APIException('invalid_request', 'connection not found');
    }

    let key;
    if (credentials.connection == 'email') {
      key = credentials.email;
    } else if (credentials.connection == 'sms') {
      key = credentials.phone_number;
    }

    const token = await this.passwordlessTokenRepository.findToken(
      ctx,
      'login',
      key,
    );

    console.log('token: ', key, token);

    if (
      token &&
      credentials.otp &&
      token.value.toLowerCase() == credentials.otp.toLowerCase()
    ) {
      await this.passwordlessTokenRepository.deleteToken(ctx, 'login', key);


      // 验证成功

      // 创建新用户
      let user;
      if (credentials.connection == 'email') {
        user = await this.userService.findByEmail(ctx, credentials.connection, credentials.email);
      } else if (credentials.connection == 'sms') {
        user = await this.userService.findByPhoneNumber(ctx, credentials.connection, credentials.phone_number);  
      }

      // 更新
      const now = new Date();
      if (user) {
        await this.userService.update(ctx, user.user_id, {
          signup_ip: ctx.req.ip,
          last_login: now,
        });
      } else {
        const user_id = nanoid(24);

        user = await this.userService.create(ctx, {
          user_id: `${connection.strategy}|${user_id}`,
          ...(credentials.connection === 'email' ? { email: credentials.email } : { phone_number: credentials.phone_number }),
          signup_ip: ctx.req.ip,
          signup_at: now,
          last_login: now,
          connection: connection.name,
          identities: [
            {
              user_id,
              provider: connection.strategy,
              connection: connection.name,
            } as IdentityModel,
          ],
        });
      }

      return { ...user };
    }

    Logger.warn(`passwordless 登录失败, 验证码无效: ${key}, ${credentials.otp}`,);

    throw new APIException('invalid.vcode');
  }
}
