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

<a href="https://authok.cn" target="_blank">Authok</a> is a multi-tenant IDaaS system, providing Identity Providers like OIDC, SAML, WsFed. It supports tenant management, user management, permission/role management, and API management. The OIDC Identity Provider is based on the <a href="https://github.com/panva/node-oidc-provider" target="_blank">node-oidc-provider</a> implementation, which is currently the only javascript project selected by <a href="https://openid.net/developers/certified/" target="_blank">openid.net</a>, and we have made some improvements to it (<a href="https://github.com/authok/node-oidc-provider" target="_blank">improvement project</a>).

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

## 测试

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker 主镜像构建
```bash
docker build -t authok/api-server .
```

## 打tag镜像并上传
```bash
docker tag authok/api-server ccr.ccs.tencentyun.com/authok/api-server:latest
docker push ccr.ccs.tencentyun.com/authok/api-server:latest
```

### 重新部署
```bash
kubectl -n authok rollout restart deployment api-server
kubectl -n authok rollout restart deployment mgmt-api-server
```

查看部署情况
```bash
kubectl -n authok get pods
```

## Docker webtask 镜像构建
```
docker build -t authok/webtask-action . -f Dockerfile.webtask
```

## tag webtask 镜像并上传
```bash
docker tag authok/webtask-action ccr.ccs.tencentyun.com/authok/webtask-action:latest
docker push ccr.ccs.tencentyun.com/authok/webtask-action:latest
```

## k8s deployment

# api-server

# mgmt-server

# webtask-action



## 创建主租户账号
```bash
DRIVER=mysql \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn cli create:mgmt_tenant --region cn --name mgmt
```





### 配置 flink 数据统计

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





## 保持联系

- 作者 - [edison](dev@authok.cn)
- 网站 - [https://authok.cn](https://authok.cn/)
- Twitter - [@edisonxp](https://x.com/edisonxp)

## License

[MIT licensed](LICENSE).


## 参考

### SAML
#### [SAML tool](http://www.samltool.com/decode.php)



### Reference Projects
https://is.docs.wso2.com/en/latest/guides/login/log-into-google-using-is/

https://www.propelauth.com/


https://github.com/juicycleff/ultimate-backend