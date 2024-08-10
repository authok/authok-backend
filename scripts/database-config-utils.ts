import * as Joi from 'joi';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { isEmpty } from 'lodash';
const url = require('url');
const querystring = require('querystring');

export function filePathForEnvVars(env: string | undefined): string {
  if (env === 'DEV') {
    return path.resolve(process.cwd(), `.env.dev`);
  } else {
    return path.resolve(process.cwd(), `.env`);
  }
}

export function getEnvVars() {
  let data: any = process.env;

  const envVarsFilePath = filePathForEnvVars(process.env.ENV)
  if (fs.existsSync(envVarsFilePath)) {
    data = { ...data, ...dotenv.parse(fs.readFileSync(envVarsFilePath)) };
  }
  data = {
    ...data,
    ...(data.DATABASE_URL && buildDbConfigFromDatabaseURL(data)),
  };

  return data;
}

function buildDbConfigFromDatabaseURL(data): any {
  const config = buildDbConfigFromUrl(data.DATABASE_URL);

  const { value: dbConfig, error } = validateDatabaseConfig({
    DATABASE_URL: data.DATBASE_URL,
    DB_HOST: config?.host || data.DB_HOST,
    DB_PORT: config?.port || data.DB_PORT,
    DB_PASSWORD: config?.password || data.DB_PASSWORD,
    DB_USER: config?.user || data.DB_USER,
    DB_NAME: config?.database || data.DB_NAME,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return removeEmptyKeys(dbConfig);
}

function buildDbConfigFromUrl(dbURL): any {
  let config: any;
  if (dbURL) {
    const parsedUrl = url.parse(dbURL, false, true);
    config = querystring.parse(parsedUrl.query);
    config.driver = parsedUrl.protocol.replace(/:$/, '');

    if (parsedUrl.auth) {
      const userPassword = parsedUrl.auth.split(':', 2);
      config.user = userPassword[0];

      if (userPassword.length > 1) config.password = userPassword[1];
      if (parsedUrl.pathname)
        config.database = parsedUrl.pathname
          .replace(/^\//, '')
          .replace(/\/$/, '');
      if (parsedUrl.hostname) config.host = parsedUrl.hostname;
      if (parsedUrl.port) config.port = parsedUrl.port;
    }
  }
  return config;
}

function removeEmptyKeys(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => !isEmpty(v))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

function validateDatabaseConfig(dbConfig: any): Joi.ValidationResult {
  const envVarsSchema = Joi.object()
    .keys({
      DRIVER: Joi.string().default('postgres'),
      DB_NAME: Joi.string(),
      DB_HOST: Joi.string().default('localhost'),
      DB_PORT: Joi.number().positive().default(5432),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string().default(''),
      TIMEZONE: Joi.string().default('Z'),
      DB_LOGGING: Joi.boolean().default(true),
    })
    .unknown();

  return envVarsSchema.validate(dbConfig);
}

export function buildAndValidateDatabaseConfig(): Joi.ValidationResult {
  const config: any = getEnvVars();
  const dbConfig = {
    type: config.DRIVER,
    name: config.DB_NAME,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    timezone: config.TIMEZONE,
    logging: config.DB_LOGGING,
  };

  return validateDatabaseConfig(dbConfig);
}
