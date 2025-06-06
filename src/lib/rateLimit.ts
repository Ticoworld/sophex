import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

let redisClient: Redis | null = null;
let rateLimiter: RateLimiterRedis | RateLimiterMemory | null = null;
let adminLimiter: RateLimiterRedis | RateLimiterMemory | null = null;

async function getRedisClient() {
  if (!process.env.REDIS_URL) return null;
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      maxRetriesPerRequest: 1,
      enableAutoPipelining: true,
      reconnectOnError: (err) => {
        console.error('Redis Reconnect Error:', err);
        return true;
      },
    });
    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('Connected to Redis'));
  }
  return redisClient;
}

async function initializeLimiters() {
  if (rateLimiter && adminLimiter) return;
  const client = await getRedisClient();
  rateLimiter = client
    ? new RateLimiterRedis({
        storeClient: client,
        points: 10, // 10 requests
        duration: 1, // per second
        keyPrefix: 'sophex-rate-limit',
      })
    : new RateLimiterMemory({
        points: 10,
        duration: 1,
      });
  adminLimiter = client
    ? new RateLimiterRedis({
        storeClient: client,
        points: 20,
        duration: 60, // 20 requests per minute for admin
        keyPrefix: 'sophex-admin-rate-limit',
      })
    : new RateLimiterMemory({
        points: 20,
        duration: 60,
      });
}

function getClientIP(req: NextRequest): string {
  const headers = req.headers;
  const ip = headers.get('cf-connecting-ip') ||
             headers.get('x-real-ip') ||
             headers.get('x-forwarded-for')?.split(',')[0].trim() ||
             'unknown';
  return ip;
}

export async function rateLimit(req: NextRequest) {
  try {
    await initializeLimiters();
    if (!rateLimiter) return null;
    const ip = getClientIP(req);
    if (ip === 'unknown') console.warn('Unknown IP address for rate limiting');
    const path = req.nextUrl.pathname;
    if (path.startsWith('/api/auth/') || path === '/api/spin') return null;
    await rateLimiter.consume(ip);
    return null;
  } catch (error) {
    console.error('Rate Limit Error:', error);
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  }
}

export async function rateLimitAdmin(req: NextRequest) {
  try {
    await initializeLimiters();
    if (!adminLimiter) return null;
    const ip = getClientIP(req);
    if (ip === 'unknown') console.warn('Unknown IP address for admin rate limiting');
    const path = req.nextUrl.pathname;
    if (path.includes('/session')) return null;
    await adminLimiter.consume(ip);
    return null;
  } catch (error) {
    console.error('Admin Rate Limit Error:', error);
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  process.on('SIGTERM', () => {
    if (redisClient) {
      redisClient.quit();
      redisClient = null;
    }
  });
}