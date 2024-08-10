import { HttpModule, Module, Global } from '@nestjs/common';
import { SharedModule } from 'libs/shared/src/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, RedisService } from '@authok/nestjs-redis';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RuleModule } from './modules/rule/rule.module';
import { GuardianModule } from './modules/guardian/guardian.module';
import configuration from 'apps/webapp-mgmt/src/config/configuration';
import { auth } from '@authok/express-openid-connect';
import { AuthokOpenidConnectModule } from '@authok/nestjs-openid-connect';
import * as ConnectRedis from 'connect-redis';

const RedisStore = ConnectRedis(auth);

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
    AuthokOpenidConnectModule.forRootAsync({
      useFactory: (redisService: RedisService) => {
        return {
          idpLogout: true,
          session: {
            store: new RedisStore({ client: redisService.getClient() }),
          },
        };
      },
      inject: [RedisService],
    }),
    SharedModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: process.env.DRIVER || 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: +process.env.DB_PORT || 5432,
          username: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || 'root',
          database: process.env.DB_DATABASE || 'authok_oidc',
          // entities: ['**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: false,
          timezone: process.env.TIMEZONE || 'Z',
          logging: true,
          // cli: {
          //  migrationsDir: 'src/migrations',
          // },
        } as TypeOrmModuleOptions;
      },
    }),
    RuleModule,
    GuardianModule,
  ],
  controllers: [],
  providers: [],
})
export class WebAppMgmtModule {}
