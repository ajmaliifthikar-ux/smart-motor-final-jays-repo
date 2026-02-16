import redis from './redis'

// Types
export interface KnowledgeEntry {
    id: string
    type: 'service' | 'vehicle' | 'faq' | 'skill' | 'policy' | 'product'
    title: string
    content: string
    keywords: string[]
    metadata?: Record<string, any>
    embedding?: number[]
    createdAt: number
    updatedAt: number
}

/**
 * Global Knowledge Base Manager
 * Stores company-wide information accessible to ALL AI agents
 */
export class KnowledgeBaseManager {
    /**
     * Add or update knowledge entry
     */
    async addKnowledge(entry: Omit<KnowledgeEntry, 'createdAt' | 'updatedAt'>): Promise<void> {
        const knowledge: KnowledgeEntry = {
            ...entry,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }

        // Store knowledge
        const key = `knowledge:${entry.type}:${entry.id}`
        await redis.set(key, JSON.stringify(knowledge))

        // Index by type
        await redis.sadd(`knowledge:index:${entry.type}`, entry.id)

        // Index keywords for search
        for (const keyword of entry.keywords) {
            await redis.sadd(`knowledge:keyword:${keyword.toLowerCase()}`, entry.id)
        }

        console.log(`✅ Knowledge added: ${entry.type}/${entry.id}`)
    }

    /**
     * Get knowledge by ID
     */
    async getKnowledge(type: string, id: string): Promise<KnowledgeEntry | null> {
        const key = `knowledge:${type}:${id}`
        const data = await redis.get(key)
        return data ? JSON.parse(data) : null
    }

    /**
     * Search knowledge by keywords
     */
    async searchKnowledge(query: string, limit: number = 5): Promise<KnowledgeEntry[]> {
        try {
            const keywords = query.toLowerCase().split(' ')
            const matchedIds = new Set<string>()

            // Find entries matching keywords
            for (const keyword of keywords) {
                const ids = await redis.smembers(`knowledge:keyword:${keyword}`).catch(() => [])
                ids.forEach(id => matchedIds.add(id))
            }

            // Load all matched entries
            const results: KnowledgeEntry[] = []
            for (const id of Array.from(matchedIds).slice(0, limit)) {
                // Try all types
                for (const type of ['service', 'vehicle', 'faq', 'skill', 'policy', 'product']) {
                    const entry = await this.getKnowledge(type, id)
                    if (entry) {
                        results.push(entry)
                        break
                    }
                }
            }

            return results
        } catch (e) {
            console.error('Search Knowledge error:', e)
            return []
        }
    }

    /**
     * Get all knowledge of a specific type
     */
    async getKnowledgeByType(type: string): Promise<KnowledgeEntry[]> {
        try {
            const ids = await redis.smembers(`knowledge:index:${type}`).catch(() => [])
            const entries: KnowledgeEntry[] = []

            for (const id of ids) {
                const entry = await this.getKnowledge(type, id)
                if (entry) entries.push(entry)
            }

            return entries
        } catch (e) {
            return []
        }
    }

    /**
     * Delete knowledge
     */
    async deleteKnowledge(type: string, id: string): Promise<void> {
        const key = `knowledge:${type}:${id}`

        // Get entry to remove keywords
        const entry = await this.getKnowledge(type, id)
        if (entry) {
            for (const keyword of entry.keywords) {
                await redis.srem(`knowledge:keyword:${keyword.toLowerCase()}`, id)
            }
        }

        // Delete entry
        await redis.del(key)
        await redis.srem(`knowledge:index:${type}`, id)
    }

    /**
     * Get relevant knowledge for AI context
     */
    async getRelevantKnowledge(query: string, maxResults: number = 3): Promise<string> {
        const entries = await this.searchKnowledge(query, maxResults)

        if (entries.length === 0) {
            return 'No specific knowledge found for this query.'
        }

        return entries
            .map(entry => `[${entry.type.toUpperCase()}] ${entry.title}:\n${entry.content}`)
            .join('\n\n---\n\n')
    }

    /**
     * Seed initial knowledge base
     */
    async seedKnowledge(): Promise<void> {
        console.log('🌱 Seeding knowledge base...')

        // Services
        await this.addKnowledge({
            id: 'oil-change',
            type: 'service',
            title: 'Oil Change Service',
            content: 'Full synthetic oil change service includes: drain old oil, replace oil filter, refill with premium synthetic oil (5W-30 or 5W-40 depending on vehicle), check fluid levels. Price: AED 280-350. Duration: 30-45 minutes. Recommended every 10,000 km or 6 months in UAE climate.',
            keywords: ['oil', 'change', 'synthetic', 'filter', 'maintenance', 'service'],
            metadata: {
                price: '280-350 AED',
                duration: '30-45 min',
                frequency: '10,000 km'
            }
        })

        await this.addKnowledge({
            id: 'ac-repair',
            type: 'service',
            title: 'AC Repair & Service',
            content: 'Complete AC service including: gas recharge, compressor check, condenser cleaning, leak detection, blower motor inspection. Critical in UAE summer heat. Price: AED 350-800 depending on issue. Can reduce fuel consumption by up to 20% when working efficiently.',
            keywords: ['ac', 'air', 'conditioning', 'cooling', 'compressor', 'gas', 'recharge'],
            metadata: {
                price: '350-800 AED',
                critical: 'UAE summer',
            }
        })

        await this.addKnowledge({
            id: 'full-service',
            type: 'service',
            title: 'Full Service Package',
            content: 'Comprehensive service including: oil change, all fluid checks, brake inspection, tire rotation, AC service, battery test, suspension check, engine diagnostics. Price: AED 899-1,299. Duration: 2-3 hours. Recommended every 20,000 km or annually.',
            keywords: ['full', 'service', 'complete', 'comprehensive', 'package', 'maintenance'],
            metadata: {
                price: '899-1,299 AED',
                duration: '2-3 hours',
            }
        })

        // Vehicles
        await this.addKnowledge({
            id: 'mercedes-g-wagon',
            type: 'vehicle',
            title: 'Mercedes G-Wagon Specialist Care',
            content: 'G-Wagon requires 5W-40 fully synthetic oil. AC system critical due to high UAE temperatures. Recommended service: every 10,000 km. Common issues: AC compressor, suspension bushings. We specialize in Mercedes diagnostics with factory-grade equipment.',
            keywords: ['mercedes', 'g-wagon', 'g-class', 'luxury', 'suv'],
            metadata: {
                oilType: '5W-40 synthetic',
                brand: 'Mercedes',
            }
        })

        // FAQs
        await this.addKnowledge({
            id: 'oil-change-frequency',
            type: 'faq',
            title: 'How often should I change my oil in UAE?',
            content: 'In UAE climate with extreme heat (45°C+), we recommend every 10,000 km or 6 months, whichever comes first. Synthetic oil lasts longer than conventional. High temperatures degrade oil 30% faster than cooler climates.',
            keywords: ['oil', 'change', 'frequency', 'how', 'often', 'uae', 'climate'],
        })

        // Skills (How AI should respond)
        await this.addKnowledge({
            id: 'diagnose-engine-noise',
            type: 'skill',
            title: 'How to discuss engine noises',
            content: 'When customer mentions engine noise: (1) Ask when it occurs (startup, acceleration, idle), (2) Ask for description (clicking, knocking, whining), (3) Recommend bringing car for inspection, (4) Mention our free diagnostic service, (5) DO NOT diagnose over text - safety first.',
            keywords: ['engine', 'noise', 'sound', 'knocking', 'clicking', 'diagnose'],
        })

        // Policies
        await this.addKnowledge({
            id: 'warranty-policy',
            type: 'policy',
            title: 'Warranty & Guarantee',
            content: 'All services come with 30-day or 1,000 km warranty, whichever comes first. Parts have manufacturer warranty (typically 1 year). If issue returns within warranty period, we fix it free of charge. Labor warranty does not cover new issues.',
            keywords: ['warranty', 'guarantee', 'policy', 'return', 'defect'],
        })

        await this.addKnowledge({
            id: 'payment-methods',
            type: 'policy',
            title: 'Accepted Payment Methods',
            content: 'We accept: Cash (AED), Credit/Debit cards (Visa, MasterCard), Tabby (buy-now-pay-later, 4 interest-free installments), Bank transfer. No checks accepted. Payment due upon service completion.',
            keywords: ['payment', 'pay', 'tabby', 'card', 'cash', 'installment'],
        })

        console.log('✅ Knowledge base seeded!')
    }

    /**
     * Get statistics
     */
    async getStats(): Promise<{
        totalEntries: number
        byType: Record<string, number>
    }> {
        const types = ['service', 'vehicle', 'faq', 'skill', 'policy', 'product']
        const byType: Record<string, number> = {}
        let total = 0

        for (const type of types) {
            const count = await redis.scard(`knowledge:index:${type}`)
            byType[type] = count
            total += count
        }

        return { totalEntries: total, byType }
    }
}

// Export singleton
export const knowledgeBase = new KnowledgeBaseManager()
