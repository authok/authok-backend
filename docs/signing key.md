# Signing Keys

推荐使用 RS256 签名算法. Signing Key 用于签名 ID token, access token, SAML assertion, WS-Fed assertions. Signing Key 是一个 JSON Web key(JWK)

# 工作原理

当用户登录应用时，我们会创建一个包含用户信息的 token, 并使用 私钥 对 token 进行签名.
每个租户对应一个私钥.

为了验证 token 是合法并且是由 authok 产生，应用需要采用 公钥 来验证 token 的签名.
