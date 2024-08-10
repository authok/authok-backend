import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import {
  AuthenticationHandler,
  LoginFunc,
  IPrincipal,
  ICredentials,
} from 'libs/api/authentication-api/src';
import { PasswordCredentials } from './credentials';
import { 
  IUserService,
  IConnectionService,
  IClientService,
  IdentityModel, 
  ProfileDataModel,
} from 'libs/api/infra-api/src';
import { ISandboxService } from 'libs/api/sandbox-api/src/sandbox.service';
import { IRequestContext } from '@libs/nest-core';
import { nanoid } from 'nanoid';
import { WrongUsernameOrPasswordError } from 'libs/common/src/exception/exceptions';

@Injectable()
export class PasswordRealmAuthenticationHandler extends AuthenticationHandler {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IClientService')
    private readonly clientService: IClientService,
    @Inject('ISandboxService')
    private readonly sandboxService: ISandboxService,
  ) {
    super();
  }

  protected async doAuthenticate(
    ctx: IRequestContext,
    credentials: ICredentials,
  ): Promise<IPrincipal> {
    const _credentials = credentials as PasswordCredentials;

    const client = await this.clientService.retrieve(
      ctx,
      _credentials.client_id,
    );
    if (!client) {
      throw new NotFoundException('找不到对应应用');
    }

    const connection = await this.connectionService.findByName(
      ctx,
      _credentials.connection,
    );
    if (!connection) {
      Logger.error(
        `找不到对应身份源, tenant: ${ctx.tenant}, connection name: ${_credentials.connection}`,
      );
      throw new NotFoundException('找不到对应身份源');
    }

    const customLogin = async (): Promise<ProfileDataModel> => {
      // 执行脚本
      const loginFunc = await this.sandboxService.run<LoginFunc>(
        connection.options.customScripts.login,
        {
          builtin: ['crypto'],
          modules: ['mysql2', 'mongodb', 'pg', 'tedious', 'bcrypt'],
        },
      );

      const profile = await new Promise<ProfileDataModel>((resolver, reject) => {
        loginFunc(
          _credentials,
          function (err: Error, user: any) {
            if (err) reject(err);
            else resolver(user);
          },
        );
      });
      
      if (!profile) throw new WrongUsernameOrPasswordError('Wrong Username or password');

      return profile;
    };

    const loginWithAuthok = async () => {
      console.log('loginWithAuthok: ', _credentials);
      let user;
      if (_credentials.email) {
        user = await this.userService.findByEmail(ctx, _credentials.connection, _credentials.email, { addSelect: ['password'] });
        Logger.log('try email find user', user);
      } else if (_credentials.phone_number) {
        user = await this.userService.findByPhoneNumber(ctx, _credentials.connection, _credentials.phone_number, { addSelect: ['password'] });
        Logger.log('try phone_number find user', user);
      } else if (_credentials.username) {
        user = await this.userService.findByUsername(ctx, _credentials.connection, _credentials.username, { addSelect: ['password'] });
        Logger.log('try username find user', user);
    
        if (!user) {
          user = await this.userService.findByEmail(
            ctx,
            _credentials.connection,
            _credentials.username,
            {
              addSelect: ['password'],
            },
          );
          Logger.log('try username as email find user', user);
        }
    
        if (!user) {
          Logger.log('try username as phone_number find user');
    
          user = await this.userService.findByPhoneNumber(
            ctx,
            _credentials.connection,
            _credentials.username,
            {
              addSelect: ['password'],
            }
          );
        }
      }

      if (!user) {
        throw new WrongUsernameOrPasswordError(_credentials.username || _credentials.email || _credentials.phone_number, '账户名密码错误');
      }

      const isValid = await this.userService.validateUser(ctx, user, _credentials.password);
      if (!isValid) {
        throw new WrongUsernameOrPasswordError(_credentials.username || _credentials.email || _credentials.phone_number, '账户名密码错误');  
      }

      return user;
    };

    // 自定义数据库, 如果迁移模式打开, 并且开启自定义数据库, 则进行自定义登录
    if (
      connection.options &&
      connection.options.enabledDatabaseCustomization
    ) {
      Logger.debug('自定义数据库');

      // 迁移模式开启
      if (connection.options.import_mode) {
        Logger.debug('开启了迁移登录模式, 先看用户是否存在于authok');
        // 先查找指定连接创建的用户
        let existingUser = await this.userService.findByUsername(ctx, connection.name, _credentials.username);
        if (!existingUser) {
          existingUser = await this.userService.findByEmail(ctx, connection.name, _credentials.email);
        }

        if (!existingUser) {
          existingUser = await this.userService.findByPhoneNumber(ctx, connection.name, _credentials.phone_number);
        }

        if (existingUser) {
          Logger.debug('开启了迁移登录模式, 并且用户存在于authok，则用authok登录');
          const user = await loginWithAuthok();
          return { user_id: user.user_id, ...user };
        } else {
          Logger.debug('开启了迁移登录模式, 用户不存在于authok，则用自定义脚本登录，然后同步数据到authok');

          const profile = await customLogin();

          const user_id = nanoid(24);

          const savedUser = await this.userService.create(ctx, {
            user_id: connection.strategy + '|' + user_id,
            nickname: profile.nickname,
            email: profile.email,
            username: profile.username,
            phone_number: profile.phone_number,
            password: _credentials.password,
            identities: [
              {
                user_id,
                connection: connection.name,
                provider: connection.strategy,
                is_social: false,
              } as IdentityModel,
            ],
          });

          return { ...savedUser };
        }
      } else {
        Logger.debug('未开启迁移登录模式, 总是用登录脚本进行登录，且不同步数据到authok');
        const profile = await customLogin();
        return { ...profile };
      }
    } else {
      Logger.debug('未开启自定义脚本, 总是用authok登录');

      const user = await loginWithAuthok();
      return { ...user };
    }
  }
}
