# Authok IDaaS

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

<a href="https://authok.io" target="_blank">Authok</a> is a multi-tenant IDaaS system, providing Identity Providers like OIDC, SAML, WsFed. It supports tenant management, user management, permission/role management, and API management. The OIDC Identity Provider is based on the <a href="https://github.com/panva/node-oidc-provider" target="_blank">node-oidc-provider</a> implementation, which is currently the only javascript project selected by <a href="https://openid.net/developers/certified/" target="_blank">openid.net</a>, and we have made some improvements to it (<a href="https://github.com/authok/node-oidc-provider" target="_blank">improvement project</a>).

Authok is an open-source alternative to Auth0. Authok is compatible with global social identity sources and is free to customize.




## Install

```bash
$ npm install
```
or
```bash
$ yarn install
```

## Docker-compose
https://github.com/docker/compose/releases

```bash
docker-compose up -d
```

## Run

```bash

$ npm run start:api-server

# watch mode
$ npm run start:api-server:dev

# production mode
$ npm run start:api-server:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build Image
```bash
docker build -t authok/api-server .
```

### redeploy
```bash
kubectl -n authok rollout restart deployment api-server
kubectl -n authok rollout restart deployment mgmt-api-server
```

view status
```bash
kubectl -n authok get pods
```

## Build webtask Image 
```
docker build -t authok/webtask-action . -f Dockerfile.webtask
```

## k8s deployment

# api-server

# mgmt-server

# webtask-action



## Create Management Tenant
```bash
DRIVER=postgres \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn cli create:mgmt_tenant --region us --name mgmt
```





### Configure flink for data analysis

```sql
CREATE TABLE log_events (
  id STRING PRIMARY KEY NOT ENFORCED, 
  tenant STRING,
  `date` TIMESTAMP(0),
  `type` STRING,
) WITH (
  'connector' = 'mysql-cdc', 
  'hostname' = '${DB_HOST}',
  'port' = '${DB_PORT}', 
  'username' = '${DB_USER}', 
  'password' = '${DB_PASSWORD}', 
  'database-name' = '${DB_DATABASE_LOGSTREAM}', 
  'table-name' = 'log_events',
  'server-time-zone' = 'Asia/Shanghai'
);

CREATE TABLE metrics (
  tenant STRING,
  `key` STRING,
  `period` STRING,
  `time` STRING,
  `value` DECIMAL(10, 5),
  PRIMARY KEY (tenant, `period`, `key`, `time`) NOT ENFORCED
) WITH (
  'connector' = 'jdbc',
  'url' = 'jdbc:mysql://${DB_HOST}:${DB_PORT}/authok',
  'table-name' = 'metrics',
  'username' = '${DB_USER}', 
  'password' = '${DB_PASSWORD}'
);

INSERT INTO metrics SELECT tenant, `type`, 'day', DATE_FORMAT(`date`, 'yyyy-MM-dd'), count(*) FROM log_events GROUP BY tenant, `type`, DATE_FORMAT(`date`, 'yyyy-MM-dd');

```


### create cert
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.cert


## Keep Touch

- Author - [dev](dev@authok.io)
- Site - [https://authok.io](https://authok.io/)
- Twitter - [@dev](https://x.com/authok)

## License

[MIT licensed](LICENSE).


## Reference

### SAML
#### [SAML tool](http://www.samltool.com/decode.php)



### Reference Projects
https://is.docs.wso2.com/en/latest/guides/login/log-into-google-using-is/

https://www.propelauth.com/


https://github.com/juicycleff/ultimate-backend