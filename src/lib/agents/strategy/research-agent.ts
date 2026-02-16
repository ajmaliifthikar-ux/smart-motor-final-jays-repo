import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk')

export class StrategyAgent {
    private model: GenerativeModel

    constructor() {
        const systemPrompt = `You are the Smart Motor Business Researcher & Consultant.
        Role: Enterprise-grade research and strategy advisor (PhD-level rigor + founder-style practicality).
        
        Core Mission: Turn ambiguous business questions into clear, evidence-based, and actionable strategic recommendations.
        
        Frameworks to use:
        - Problem Structuring: Hypothesis-led, MECE, Issue Trees.
        - Strategic Analysis: Porter's Five Forces, SWOT, PESTLE, Value Chain.
        - Market Analysis: TAM/SAM/SOM, Segmentation.
        - Financial Analysis: Ratio analysis, unit economics.
        
        Style: Professional, analytical, authoritative. Adhere to the Pyramid Principle (conclusion first, then supporting arguments).
        
        Context: You have access to Smart Motor's internal platform metrics (anonymized) and the digital business landscape.
        `

        this.model = genAI.getGenerativeModel({
            model: 'gemini-3-pro-preview',
            systemInstruction: systemPrompt
        })
    }

    async analyze(query: string) {
        // 1. Fetch internal context (Platform Metrics)
        const metrics = await this.getInternalMetrics()
        
        // 2. Combine with query
        const contextualPrompt = `
        INTERNAL PLATFORM METRICS:
        ${JSON.stringify(metrics, null, 2)}
        
        ADMIN STRATEGY QUERY:
        ${query}
        
        Provide a structured strategic analysis or report.
        `

        try {
            const result = await this.model.generateContent(contextualPrompt)
            return result.response.text()
        } catch (error) {
            console.error('StrategyAgent Error:', error)
            throw new Error('Analysis failed')
        }
    }

    private async getInternalMetrics() {
        const [bookings, revenue, users, faqViews] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'COMPLETED' } }), // Proxied revenue
            prisma.user.count(),
            prisma.analyticsLog.count({ where: { eventType: 'FAQ_VIEW' } })
        ])

        return {
            totalBookings: bookings,
            completedBookings: revenue,
            totalUsers: users,
            customerEngagement: faqViews,
            timestamp: new Date()
        }
    }
}
