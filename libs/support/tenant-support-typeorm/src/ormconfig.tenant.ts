/* eslint-disable import/no-extraneous-dependencies */

import { getEnvVars } from 'scripts/database-config-utils';
import { DataSource } from 'typeorm';
import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

function buildDataSource(): DataSource {
  const connectionParams = {
    database: process.env.TENANCY_DB_NAME,
    port: +process.env.TENANCY_DB_PORT || 5432,
    username: process.env.TENANCY_DB_USER,
    password: process.env.TENANCY_DB_PASSWORD,
    host: process.env.TENANCY_DB_HOST,
    connectTimeoutMS: 5000,
    extra: {
      max: 25,
    },
  };

  const entitiesDir = [__dirname + '/**/*.entity.ts'];

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
