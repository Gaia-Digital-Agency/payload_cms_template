import Redis from 'ioredis'

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }
  throw new Error('REDIS_URL is not defined')
}

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('✅ Redis connected')
})

// Helper functions for common operations
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export const cacheSet = async (
  key: string,
  value: any,
  expirySeconds: number = 3600
): Promise<void> => {
  try {
    await redis.setex(key, expirySeconds, JSON.stringify(value))
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export const cacheDel = async (key: string): Promise<void> => {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

export const cacheInvalidatePattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Cache invalidate error:', error)
  }
}
