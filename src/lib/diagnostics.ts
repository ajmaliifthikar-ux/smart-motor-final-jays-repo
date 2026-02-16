import { prisma } from './prisma'

export type ServiceName = 'Firebase' | 'Gemini' | 'Redis' | 'Prisma' | 'Resend' | 'GoogleBusiness'

export interface TraceParams {
    service: ServiceName
    operation: string
    metadata?: any
}

/**
 * Traces an external integration call and logs it to the database.
 * Usage: 
 * const data = await traceIntegration({ service: 'Gemini', operation: 'generate' }, () => model.generateContent(prompt))
 */
export async function traceIntegration<T>(
    params: TraceParams,
    fn: () => Promise<T>
): Promise<T> {
    const start = Date.now()
    try {
        const result = await fn()
        const duration = Date.now() - start
        
        // Log Success (Background)
        logTrace({
            ...params,
            status: 'SUCCESS',
            duration,
        }).catch(err => console.error('Failed to log trace:', err))

        return result
    } catch (error: any) {
        const duration = Date.now() - start
        
        // Log Failure
        await logTrace({
            ...params,
            status: 'FAILURE',
            duration,
            error: error.message || String(error),
        }).catch(err => console.error('Failed to log error trace:', err))

        throw error
    }
}

async function logTrace(data: {
    service: string
    operation: string
    status: string
    duration: number
    error?: string
    metadata?: any
}) {
    try {
        await prisma.integrationTrace.create({
            data: {
                service: data.service,
                operation: data.operation,
                status: data.status,
                duration: data.duration,
                error: data.error,
                metadata: data.metadata ? JSON.stringify(data.metadata) : null,
            }
        })
    } catch (dbError) {
        console.warn(`[Trace Error] Could not log to DB: ${data.service}/${data.operation}`);
    }
}

/**
 * Diagnostic check for major services
 */
export async function runSystemDiagnostics() {
    const results: any[] = []

    // 1. Prisma Check
    const prismaStart = Date.now()
    try {
        await prisma.$queryRaw`SELECT 1`
        results.push({ service: 'Prisma', status: 'WORKING', duration: Date.now() - prismaStart })
    } catch (e: any) {
        results.push({ service: 'Prisma', status: 'FAILED', error: e.message })
    }

    // 2. Redis Check
    const redisStart = Date.now()
    try {
        const { default: redis } = await import('./redis')
        await redis.ping()
        results.push({ service: 'Redis', status: 'WORKING', duration: Date.now() - redisStart })
    } catch (e: any) {
        results.push({ service: 'Redis', status: 'FAILED', error: e.message })
    }

    // 3. Gemini Check
    const geminiStart = Date.now()
    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk')
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        await model.generateContent('ping')
        results.push({ service: 'Gemini', status: 'WORKING', duration: Date.now() - geminiStart })
    } catch (e: any) {
        results.push({ service: 'Gemini', status: 'FAILED', error: e.message })
    }

    return results
}
