export default () => ({
  queue: {
    host: process.env.BULL_QUEUE_HOST,
    port: process.env.BULL_QUEUE_PORT,
  },
  services: {
    baseUrl: process.env.SERVICE_BASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS || '',
  },
});
