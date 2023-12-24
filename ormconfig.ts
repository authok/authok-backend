import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnvVars } from './scripts/database-config-utils';

function dbSslConfig(envVars) {
  let config = {};

  if (envVars?.DATABASE_URL)
    config = {
      url: envVars.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };

  if (envVars?.CA_CERT)
    config = {
      ...config,
      ...{ ssl: { rejectUnauthorized: false, ca: envVars.CA_CERT } },
    };

  return config;
}

function buildConnectionOptions(data): TypeOrmModuleOptions {
  const connectionParams = {
    database: data.DB_NAME,
    port: +data.DB_PORT || 5432,
    username: data.DB_USER,
    password: data.DB_PASSWORD,
    host: data.DB_HOST,
    connectTimeoutMS: 5000,
    extra: {
      max: 25,
    },
    ...dbSslConfig(data),
  };

  const entitiesDir =
    data?.NODE_ENV === 'test'
      ? [__dirname + '/**/*.entity.ts']
      : [__dirname + '/**/*.entity{.js,.ts}'];

  return {
    type: 'postgres',
    ...connectionParams,
    entities: entitiesDir,
    synchronize: false,
    uuidExtension: 'pgcrypto',
    migrationsRun: false,
    migrationsTransactionMode: 'all',
    logging: data.DB_LOGGING || false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    keepConnectionAlive: true,
    cli: {
      migrationsDir: 'migrations',
    },
  };
}

const data = getEnvVars();
const ormconfig: TypeOrmModuleOptions = buildConnectionOptions(data);

export { ormconfig };
export default ormconfig;
