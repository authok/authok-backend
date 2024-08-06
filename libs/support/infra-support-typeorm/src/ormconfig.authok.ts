/* eslint-disable import/no-extraneous-dependencies */

import { getEnvVars } from 'scripts/database-config-utils';
import { DataSource } from 'typeorm';
import { join } from 'path';

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

function buildDataSource(data): DataSource {
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

  const entitiesDir = [
    __dirname + '/**/*.entity.ts',
    join('libs/oidc/common/**/*.entity.ts'),
  ];

  return new DataSource({
    type: 'postgres',
    ...connectionParams,
    entities: entitiesDir,
    synchronize: false,
    uuidExtension: 'pgcrypto',
    migrationsRun: false,
    migrationsTransactionMode: 'all',
    logging: data.DB_LOGGING || false,
    migrations: [__dirname + `/../migrations/**/*{.ts,.js}`],
  });
}

const data = getEnvVars(process.env.DB_REGION ?? 'asia_1');
const datasource = buildDataSource(data);

export default datasource;
