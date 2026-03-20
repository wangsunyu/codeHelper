import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy(times) {
    return times > 1 ? null : 200;
  },
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message || 'connection failed');
});
