export default () => ({
  domain: process.env.DOMAIN ?? 'authok.io',
  ipstack: {
    url: 'http://api.ipstack.com',
    access_key: '1e599a1240ca8f99f0b0d81a08324dbb',
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
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS || '',
  },
});
