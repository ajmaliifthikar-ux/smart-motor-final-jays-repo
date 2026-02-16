import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { StrategyAgent } from '@/lib/agents/strategy/research-agent'

export async function POST(req: Request) {
    try {
        await requireAdmin()
        const { query } = await req.json()
        const agent = new StrategyAgent()
        const response = await agent.analyze(query)
        
        return NextResponse.json({ response })
    } catch (error) {
        console.error('Strategy API Error:', error)
        return NextResponse.json({ error: 'Failed to process strategy query' }, { status: 500 })
    }
}
