import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { 
  IDBConnectionService,
  ITenantService,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnection,
  getConnectionManager,
} from 'typeorm';
import { LRUCache } from 'lru-cache';
import { Interval } from '@nestjs/schedule';

ConnectionManager.prototype['close'] = async function (name: string) {
  const conn = this.connectionMap.get(name);
  if (!conn) return;

  this.connectionMap.delete(name);

  await conn.close();
};

@Injectable()
export class TenantConnectionManager {
  private entities = new Array<EntityClassOrSchema>();
  private cache: LRUCache<string, Connection>;

  constructor(
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
    @Inject('IDBConnectionService')
    private readonly dbConnectionService: IDBConnectionService,
  ) {
    const options: LRUCache.Options<string, Connection, any> = {
      max: 1000,
      noDisposeOnSet: true,
      dispose: async function (n: Connection, key: string, r: LRUCache.DisposeReason) {
        const cm = getConnectionManager();
        Logger.log(
          '准备清理连接, conn: ' + key + ', size: ' + cm.connections.length,
        );

        await (cm as any).close(n.name);
        Logger.log(
          '清理连接后, conn: ' + key + ', size: ' + cm.connections.length,
        );
      },
      ttl: 1000 * 60 * 60,
    };

    this.cache = new LRUCache<string, Connection>(options);
  }

  addEntities(...items: EntityClassOrSchema[]) {
    items.forEach((it) => Logger.log(`加载 Entity: ${it.constructor.name}`));
    this.entities.push(...items);
  }

  async get(ctx: IContext): Promise<Connection> {
    if (!ctx.tenant) {
      return getConnection();
    }

    const tenant = await this.tenantService.retrieve({}, ctx.tenant);
    if (!tenant) {
      throw new BadRequestException(`tenant ${ctx.tenant} not found`);
    }

    let dbname;
    if (tenant.config && tenant.config.dbname) {
      dbname = tenant.config.dbname;
      Logger.log(`1. 从租户 ${ctx.tenant} 配置加载到 dbname: ${dbname}`);
    } else {
      if (process.env.ENV === 'DEV') {
        dbname = 'authok';
        Logger.log(
          `1.1 租户 ${ctx.tenant} 没有配置连接, 由于是开发环境, 加载默认 dbname: ${dbname}`,
        );
      } else {
        dbname = 'authok';
        Logger.log(
          `1.2 租户 ${ctx.tenant} 没有配置连接, 由于是正式环境, 目前先加载默认 dbname`,
        );
        // throw new BadRequestException(`tenant config not found for ${ctx.tenant}!`);
      }
    }

    try {
      const conn = getConnection(dbname);
      Logger.log(`2. 租户 ${ctx.tenant} 从连接池拿到连接: ${dbname}`);

      const ok = this.cache.set(dbname, conn);
      if (!ok) {
        Logger.error(`2.1. 租户 ${ctx.tenant} 设置连接 ${dbname} 到缓存失败`);
      }
      return conn;
    } catch (e) {
      if (this.cache.size >= 1000) {
        Logger.error('3.1. 连接池满了 count: ' + this.cache.size);
        throw new BadRequestException('连接池已满', '连接池已满');
      }

      Logger.log(
        `3.2. 连接池没有连接，从租户 ${ctx.tenant} 创建连接 ${dbname}, typeorm_entities: `,
        this.entities,
      );

      let options: ConnectionOptions;
      if (tenant.config && tenant.config.dbname) {
        const dbConnection = await this.dbConnectionService.retrieve(
          {},
          tenant.config.dbname,
        );
        options = options = dbConnection as ConnectionOptions;
        Logger.log(
          `4.1 加载到租户 ${ctx.tenant} 的 数据源名字 ${dbname} 对应的数据源配置`,
        );
      }

      if (!options) {
        if (!dbname /* process.env.ENV !== 'DEV'*/) {
          Logger.error(
            `5.1. 没有加载到租户 ${ctx.tenant} 的 数据源名字 ${tenant.config.dbname} 对应的数据源配置, 不是开发环境，抛出异常`,
          );
          throw new BadRequestException('数据源配置没有找到');
        } else {
          Logger.error(
            `5.2. 没有加载到租户 ${ctx.tenant} 的 数据源名字 ${dbname} 对应的数据源配置, 由于是开发环境, 加载默认数据源`,
          );

          options = {
            name: dbname,
            type: process.env.DRIVER || ('postgres' as any),
            host: process.env.DB_HOST || 'localhost',
            port: +process.env.DB_PORT || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || `authok_default`,
            synchronize: false,
            timezone: process.env.TIMEZONE || 'Z',
            logging: Object.is(process.env.DB_LOGGING, 'true'),
          };
        }
      }

      let createdConnection: Connection;
      try {
        createdConnection = await createConnection({
          ...options,
          entities: this.entities,
        });
      } catch (e) {
        console.error(`为租户 ${ctx.tenant} 创建数据库连接失败`, e);
      }

      if (!createdConnection) {
        throw new BadRequestException(
          'Database Connection Error',
          'There is a Error with the Database!',
        );
      }

      this.cache.set(dbname, createdConnection);

      return createdConnection;
    }
  }

  getAll(): Connection[] {
    console.log('getAllxx');
    const connectionManager = getConnectionManager();
    return connectionManager.connections;
  }

  @Interval(60000)
  async checkConnectionAlive() {
    const connectionManager = getConnectionManager();
    connectionManager.connections.forEach(async (conn) => {
      // Logger.debug('check connection: ' + conn.options.name);
      this.cache.get(conn.options.name);
    });
  }
}
