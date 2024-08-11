export default () => ({
  domain: process.env.DOMAIN,
  default: {
    phone_country_code: '86',
  },
  region: 'cn',
  trigger: {
    host: process.env.TRIGGER_HOST || 'http://localhost:3008',
  },
  ipstack: {
    url: 'http://api.ipstack.com',
    access_key: '1e599a1240ca8f99f0b0d81a08324dbb',
  },
  taobao_ip: {
    access_key: 'alibaba-inc',
  },
  mailer: {
    host: '',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: '',
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
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: process.env.REDIS_PORT ?? 6379,
    password: process.env.REDIS_PASS ?? '',
  },
  tenant_service: {
    addr: process.env.TENANT_SERVICE_ADDR ?? 'localhost:3002'
  },
  marketplace_service: {
    addr: process.env.MARKETPLACE_SERVICE_ADDR ?? 'localhost:3006'
  }
});
