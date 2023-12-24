export default () => ({
  domain: 'authok.cn',
  trigger: {
    host: process.env.TRIGGER_HOST || 'http://localhost:3008',
  },
  management: {
    tenant: 'org_1',
    client_id: 'B2b8F5A5yGqkAgSM8i2yotsGeSnurxDJ', // 默认用于登录的 client
    client_secret: 'COQQOeSvNXPSbzucGVdRtmi6KtfHFcqxDEFRy79Dzooo-_spR6TBH9tjLzaeoiE_',
    domain: 'mgmt.cn.authok.cn',
    audience: 'https://mgmt.authok.cn/api/v1'
  },
  ipstack: {
    url: 'http://api.ipstack.com',
    access_key: '1e599a1240ca8f99f0b0d81a08324dbb',
  },
  mailer: {
    host: 'smtp.126.com',
    port: 465,
    secure: true,
    auth: {
      user: 'newtalentxp@126.com',
      pass: 'edison@2012',
    },
  },
  queue: {
    host: process.env.BULL_QUEUE_HOST,
    port: process.env.BULL_QUEUE_PORT,
  },
  services: {
    baseUrl: process.env.SERVICE_BASE_URL,
    sms: {
      apihost: 'https://api.fat.lucfish.com',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS || '',
  },
});
