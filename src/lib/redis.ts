import Redis from 'ioredis'

// Redis connection with lazyConnect for serverless compatibility (Vercel)
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    lazyConnect: true,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
    },
})

redis.on('error', (err) => {
    console.error('Redis connection error:', err)
})

redis.on('connect', () => {
    console.log('✅ Redis connected successfully')
})

export default redis
