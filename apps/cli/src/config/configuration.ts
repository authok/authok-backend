export default () => ({
  domain: process.env.DOMAIN ?? 'authok.io',
  management: {
    tenant: process.env.MGMT_TENANT,
    client_id: process.env.MGMT_CLIENT_ID, // 默认用于登录的 client
    client_secret: process.env.MGMT_CLIENT_SECRET,
    domain: process.env.MGMT_DOMAIN,
    audience: process.env.MGMT_AUDIENCE,
  },
  redis: {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: process.env.REDIS_PORT ?? 6379,
    password: process.env.REDIS_PASS ?? '',
    tls: Object.is(process.env.REDIS_SSL_ENABLED, 'true'),
  },
  tenant_service: {
    addr: process.env.TENANT_SERVICE_ADDR ?? 'localhost:3002'
  },
  marketplace_service: {
    addr: process.env.MARKETPLACE_SERVICE_ADDR ?? 'localhost:3006'
  }
});
