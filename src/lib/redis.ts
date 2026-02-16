import Redis from 'ioredis'

// Redis connection with lazyConnect for serverless compatibility (Vercel)
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    lazyConnect: true,
    connectTimeout: 1000, // 1 second timeout
    commandTimeout: 1000, // 1 second timeout
    maxRetriesPerRequest: 1, // Don't hang on failures
    retryStrategy(times) {
        return null // Stop retrying immediately if it fails
    },
})

redis.on('error', (err) => {
    console.error('Redis connection error:', err)
})

redis.on('connect', () => {
    console.log('✅ Redis connected successfully')
})

export default redis
