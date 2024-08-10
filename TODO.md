### jwks 公钥获取

https://github.com/auth0/node-jwks-rsa

### auth0 的 token 格式 / 对照 authing

Q. management api 的 token 获取流程

# FAQ

Q. express 的 req.isAuthenticated() 机制
A. 如果 req.user 不为空, 返回 true; 否则，返回 false.

### 多租户动态数据库连接，可用作 Connection 自定义数据库连接

https://github.com/Fonavn/core/blob/658ef4451339de10afedfaefc1de6a0fe69b947a/libs/tenant/src/tenant.module.ts

# 返回值校验 schema

目前还没找到注解框架可以做返回值 schema 限定

# 登录验证码, 先看看腾讯的

### web 前端新手引导: react-joyride, auth0 在 actions/flow 里使用,

### web 前端代码编辑器 monaco-editor, auth0 使用, 我们可使用 react-monaco-editor

### tenant 重构 [OK]

### nestjs 8.0.0 nest-redis 的 bug [OK]

https://github.com/skunight/nestjs-redis/issues/82

### 改造 node-provider, 让 client_credentials 自定义查找 client-grant 的权限. 需要暴露一个扩展点, features.customScopes(ctx, grantType)

### 实现 lock的跨域账户密码登录
  client 获取 enabled_connections, 然后进行分组
  client 关联 client_grant



interaction的 cookie path设置的 /login
换在 /usernamepassword/ 下请求就找不到对应cookie了

对比下 authing的单点登录实现


### 构建文档的工具
react: https://github.com/facebook/docusaurus
vue: vuepress

### Nestjs的 Middleware 没有办法 等待 next 执行结果:
```js
# pre process

await next();

# post process
```
这里不会严格按照顺序来，还没空找根本原因


### 实现 短信 找回密码功能 [ok]

### 实现了 微信二维码扫码 登录功能 [ok]

### 实现 微信 登录功能 [ok]


### 实现 email 找回密码功能 [todo]

### [lock] 优化 用户名密码登录 功能 [ok]
用户名 / email / phone 适配


# typeorm 时区问题暂定解决, 引发 游标查询比较出错 [todo]



# typeorm update 级联 save
目前先获取 已存在对象，通过 repo.merge(existingEntity, data) 进行增量更新
缺点是性能问题，要先从数据库拿到对象树，再merge了保存，typeorm保存的时候做了diff，应该内部维护了时间戳/版本/脏标记

# client-grant 和 app_type之间有一些匹配规则
client-grant 只能授权给 machine to machine(app_type = non_interactive/web)的应用

app_type = non_interactive/web的应用
token_endpoint_auth_method = client_secret_base, client_secret_post 的应用,

# comment some conditions in node-oidc-provider
grant_type contains implict
redirect_uris null error.

# organization login[working]
用户通过authorize 端点登录，携带 org_id
1. 请求授权码流程
  经过了用户认证
     密码认证
        1. 用给定 connection 和 user 进行身份认证 (如果有传 org_id, 要前置判断 connection是否被 org_id允许), 解决方案是追加一个 Prompt login check [TODO]
     第三方社会化认证
        1. 在请求时，只能 check 判断 client, connection的合法性, 这个check要前置, 要在check session之前
        2. 回调时, 如果有传 org_id, 要前置判断 connection是否被 org_id, 允许

2. 根据授权码请求 access_token / id_token
   授权码流程会触发调用 loadExistGrants
      grant不存在，进行创建

3. 请求 access_token, 
   会触发调用 loadExistGrants
      这里grant已经存在
          如果 session 没有org_id: 会根据 audience 去加载 user与resource_server 对应的 scopes
          如果 session 有org_id: 会根据 audience 去加载 group_member 与 resource_server 对应的 scopes


      access_token, id_token 会携带 org_id返回


这里需要找 authorize 授权 和 获取token 都能经过的入口，去设置 org_id

1. 在 authorize 认证阶段，org_id的错误要能影响认证成功. 
2. 在认证成功，日后变更 org_id 获取 授权码时，有拦截点能阻止授权码成功. 

目前拦截点 仅存在两处： loadExistingGrant 和 loadAccount




# 删除用户时，要把对应的 Interaction 和 Session 也清除掉, 主要是 Interaction, 否则再次访问页面会找不到 grant，但是 interaction里面 consent没有判断 grant为空直接报错 [TODO]



# 目前全 github 基于 oidc-provider 实现的多租户oidc项目 最成熟的
https://github.com/UnitedEffects/ueauth

工程化一般，技巧点有一些参考


# auth0 organization 测试
https://growingbox1.us.auth0.com/authorize?organization=org_V2es5QRmEv2RFNFy&client_id=x2ZAxx4rVRqsBMLjyQSiKNtZg76tKJal&response_type=token&redirect_uri=http://localhost:8000&scope=openid%20profile&response_mode=web_message&audience=http://test

https://growingbox1.us.auth0.com/authorize?organization=org_GXoLySGWA5p90k3u&client_id=x2ZAxx4rVRqsBMLjyQSiKNtZg76tKJal&response_type=token&redirect_uri=http://localhost:8000&scope=openid%20profile%20read:books&response_mode=web_message&audience=http://test

https://growingbox1.us.auth0.com/authorize?organization=org_K4JKyhEE4YtJZAEU&client_id=x2ZAxx4rVRqsBMLjyQSiKNtZg76tKJal&response_type=token&redirect_uri=http://localhost:8000&scope=openid%20profile%20read:books&response_mode=web_message&audience=http://test


https://growingbox1.us.auth0.com/authorize?invitation=qFlBZpW5d8gA6HTL4TQ3M4Cp5JsfPFou&organization=org_V2es5QRmEv2RFNFy&organization_name=org1&client_id=x2ZAxx4rVRqsBMLjyQSiKNtZg76tKJal&response_type=token&redirect_uri=http://localhost:8000&scope=openid%20profile%20read:books&response_mode=web_message&audience=http://test

### typeorm mysql driver 发生 同名列错误[完成]
### 给 OneToOne, OneToMany 的 JoinColumn 定义加个 fk前缀.


### k8s nginx ingress CORS问题[完成]
参考 deploy/k8s/deployment.yaml 中的配置，给 nginx 植入 cors 的处理.


# 沙箱运行代码的安全隔离[TODO, 重要不紧急]
参考 auth0 的 private api

# 租户切换的瑕疵[TODO, 重要紧急]
通过prompt方式实现了 邀请机制.
目前 lock 登录页面 结合 authok-react 时无法动态感知登录态, 需要进一步检查 [TODO]

# 检查 数据完整性问题. [初步完成]
# Java SDK 核对 以及 API. [初步完成]
发布了 1.35.2 版本

# resume的进入可能有不同 prompt, post-login应该只处理 prompt 类型为 login的. 否则 consent / invitation / login 任意 prompt都会触发 post-login的执行 [OK]

# SPA前端缓存问题 [OK]
cdn估计保留了 path缓存, 导致命中缓存后，缓存文件指向的文件是旧的，如果旧文件删除，由于404会定向到 index.html, 所以会报错.
COS + CDN 配置 参考: https://blog.csdn.net/huzhanfei/article/details/115190469
这里要主动刷新CDN缓存.

# 完成自定义域名的页面 [TODO]
完成自定义域名的页面

# 进一步完善 API文档 [TODO]
明天要把管理API文档全部完成
剩下一天完成认证API文档

# 完成今日登录用户，总退登用户统计 [TODO]


# authorize 进入 interaction 流程的时机问题 [TODO]
如果 authorize 社会化登录 进入 interaction 流程， 那如果用户先前已经在给定租户登录了，那 authorize 端点直接返回code，不会再走 interaction 流程去跳转第三方.
目前看 auth0 貌似 authorize 没有进入 interaction 流程，直接跳转到第三方，authing待确认.
解决方案： 这里在 authorize时传入 prompt=login, 可以强制弹出登录框.
但是登录后的 set cookie, 怎么处理?


# SAML 如何重用 node-oidc-provider 的认证流程 [TODO]


# authok-android 提交到 maven 仓库[TODO]


# 公众号扫码登录[DOING]






### orgId 的流程
1. 前端授权，可以在 session 存放;
2. 后端 auth code 授权, 如果走 params, 那么在 codeExchange Token 时也要带 organization, 现在解决办法是通过 authorization code的sessionId先拿到session, 再去取 authorizationFor(session)里的 orgId.


存在 grant 中，




- 完成 email 找回密码功能
- 完成 phone 短信验证码找回密码功能
- 发布 node-oidc-provider 自定义版本到 npm 仓库
- client 局部更新的问题, 可能要先查找出来，然后把修改对象和 存在对象进行一次 deepmerge, 有 metadata 字段局部更新需求的地方，都需要在业务层面做一次 deepmerge, 否则 update 局部信息会覆盖其它信息




### 很多模块的新版本都设置 type 为 module 了.
比如 node-oidc-provider, got, nanoid
但是 nestjs 对 es支持不是很好，所以现在都还是用老的一些库.

###
Tenant 独立 微服务
Tenant 改为 prisma db 访问方式


###
logstream 服务独立成微服务.


### 在数据库 migration 脚本创建初始 管理系统账号
