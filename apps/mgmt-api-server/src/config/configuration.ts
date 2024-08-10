export default () => ({
  domain: process.env.DOMAIN ?? 'authok.io',
  trigger: {
    host: process.env.TRIGGER_HOST || 'http://localhost:3008',
  },
  management: {
    tenant: process.env.MGMT_TENANT,
    client_id: process.env.MGMT_CLIENT_ID, // 默认用于登录的 client
    client_secret: process.env.MGMT_CLIENT_SECRET,
    domain: process.env.MGMT_DOMAIN,
    audience: process.env.MGMT_AUDIENCE,
  },
  ipstack: {
    url: 'http://api.ipstack.com',
    access_key: process.env.IPSTACK_ACCESS_KEY,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE === 'true',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  },
  queue: {
    host: process.env.BULL_QUEUE_HOST,
    port: process.env.BULL_QUEUE_PORT,
  },
  services: {
    baseUrl: process.env.SERVICE_BASE_URL,
    sms: {
      apihost: '',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS || '',
  },
});
