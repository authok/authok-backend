参考: https://developer.okta.com/docs/concepts/oauth-openid/#does-the-resource-owner-own-the-client

OKTA 主要有 3 种认证机制:

- Authentication API 控制对 OKTA 组织和应用程序的访问。它提供了验证用户身份，执行多因素注册和验证，找回密码和解锁账户等操作。它是 OKTA 登录小部件和 Auth JS 依赖的底层 API
- OAuth 2.0 协议控制对受保护自愿的授权访问, 如 web app, 原生 app, API 服务.
- OpenID Connect 协议建立在 OAuth 2.0 之上, 帮助认证用户和传递有关用户的信息.

### 选择 OAuth 2.0 流程

应用类型 OAuth 2.0 流程
Web 服务端 Authorization Code flow
SPA Authorization Code flow with PKCE 或者 Implicit flow(当 SPA 运行在老的，不支持 Web Crypto for PKCE 的浏览器上)
原生 APP Authorization Code flow with PKCE
Trusted Resource Owner Password flow
Service Client Credentials

### 你的应用是否支持 ID token

Grant Type, Access Token, ID Token
Authorization Code Y Y
Authorization Code with PKCE Y Y
Implicit Y Y
Resource Owner Password Y Y
Client Credentials Y x
SAML 2.0 Application Y Y
