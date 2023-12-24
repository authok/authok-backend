


DRIVER=mysql \
  PORT=4003 \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_SYNCHRONIZE=${DB_SYNCHRONIZE} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn start:api-server:dev

DRIVER=mysql \
  PORT=4005 \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_SYNCHRONIZE=${DB_SYNCHRONIZE} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn start:mgmt-api-server:dev

### 执行远程命令 - 创建应用市场分类
```bash
DRIVER=mysql \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_SYNCHRONIZE=${DB_SYNCHRONIZE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn cli create:category --slug social_connections --title 社交身份源
```

### 执行远程命令，查看身份源列表
主要可以检查数据库完备性
```bash
DRIVER=mysql \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_SYNCHRONIZE=${DB_SYNCHRONIZE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn cli list:connections --tenant org_1
```

### 执行远程命令 - 查看应用市场
```bash
DRIVER=mysql \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_SYNCHRONIZE=${DB_SYNCHRONIZE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn cli list:catalogs --category social-connections
```

### 执行远程命令 - 查看给定组织开启的身份源
```bash
DRIVER=mysql \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_SYNCHRONIZE=${DB_SYNCHRONIZE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn cli organization:enabled_connections --tenant org_1 --org_id org_1
```

### 执行远程命令 - 创建远程测试租户
```bash
DRIVER=mysql \
  DB_HOST=${DB_HOST} \
  DB_PORT=${DB_PORT} \
  DB_USER=${DB_USER} \
  DB_DATABASE=${DB_DATABASE} \
  DB_SYNCHRONIZE=${DB_SYNCHRONIZE} \
  DB_PASSWORD=${DB_PASSWORD} \
  DB_DATABASE_LOGSTREAM=${DB_DATABASE_LOGSTREAM} \
  yarn cli create:mgmt_tenant --region dev --name mgmt
```

### 本地 mysql 测试
```bash
DRIVER=mysql \
  DB_HOST=localhost \
  DB_PORT=13306 \
  DB_USER=authok \
  DB_DATABASE=authok_mgmt \
  DB_PASSWORD=1234567890 \
  DB_DATABASE_LOGSTREAM=authok_logstream \
  yarn start:api-server:dev
```

# 本地MySql 创建租户
```bash
DRIVER=mysql \
  DB_HOST=localhost \
  DB_PORT=3306 \
  DB_USER=authok \
  DB_DATABASE=authok_mgmt \
  DB_PASSWORD=1234567890 \
  DB_DATABASE_LOGSTREAM=authok_logstream \
  yarn cli create:mgmt_tenant --region dev --name mgmt
```