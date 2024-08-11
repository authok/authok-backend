/* eslint-disable import/no-extraneous-dependencies */

import { DataSource } from 'typeorm';
import { join, resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

function buildDataSource(): DataSource {
  const connectionParams = {
    database: process.env.DB_NAME,
    port: +process.env.DB_PORT ?? 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    connectTimeoutMS: 5000,
    extra: {
      max: 25,
    },
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
    logging: ['error'],
    migrations: [__dirname + `/../migrations/**/*{.ts,.js}`],
  });
}

const datasource = buildDataSource();

export default datasource;
