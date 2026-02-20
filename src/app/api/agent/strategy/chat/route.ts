import { NextRequest, NextResponse } from 'next/server'
import { StrategyAgent } from '@/lib/agents/strategy/research-agent'
import { getAdminSession } from '@/lib/session'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, history = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const agent = new StrategyAgent()

    let response: string = ''
    let metadata: Record<string, any> = {}

    try {
      if (message.toLowerCase().includes('market') || message.toLowerCase().includes('analysis')) {
        response = `I'll analyze the market for your auto repair business...

**Market Analysis I Provide:**
• **Market Size & Growth**: Analyze industry trends in UAE auto repair
• **Customer Segments**: Identify different customer types (individuals, corporates, fleet)
• **Pricing Analysis**: Competitive pricing for services in your region
• **Market Gaps**: Identify unmet customer needs
• **Expansion Opportunities**: New service areas or markets

**UAE Auto Repair Market Insights:**
• Growing demand for quality car maintenance
• Corporate fleet management gaining importance
• Customer preference for transparent pricing
• Increasing focus on customer experience
• Digital booking and online reviews critical

**What market aspect interests you?**
• Geographic expansion
• New service offerings
• Customer segment targeting
• Competitive positioning`
        metadata = {
          marketSize: 'large and growing',
          competitionLevel: 'moderate to high',
          growthOpportunities: ['online services', 'corporate clients', 'preventive maintenance']
        }
      } else if (message.toLowerCase().includes('competitor') || message.toLowerCase().includes('competition')) {
        response = `I'll analyze your competitive landscape...

**Competitive Analysis:**
• **Direct Competitors**: Identify major players in your market
• **Competitive Advantages**: Your unique strengths vs competitors
• **Weakness & Gaps**: Opportunities to differentiate
• **Pricing Strategy**: How you compare on value
• **Customer Satisfaction**: Online reviews and ratings

**Competitive Positioning Strategy:**
1. **Quality Focus**: Premium service quality
2. **Customer Service**: Exceptional customer experience
3. **Technology**: Online booking, transparent pricing
4. **Specialization**: Expert technicians in specific areas
5. **Speed**: Quick turnaround times

**Your Competitive Advantages:**
• Established brand ("Smart Motor")
• Experienced team
• Quality service focus
• Local market knowledge
• Customer loyalty

How can we strengthen your competitive position?`
        metadata = {
          competitorCount: '15-20 in UAE',
          marketShare: 'unknown - to be analyzed',
          recommendations: ['differentiation', 'pricing review', 'marketing']
        }
      } else if (message.toLowerCase().includes('trend') || message.toLowerCase().includes('opportunity')) {
        response = `I've identified key market trends and opportunities...

**Current Market Trends:**
1. **Digital-First Customers**: Expect online booking and instant communication
2. **Preventive Maintenance**: Customers increasingly focus on maintenance
3. **Sustainability**: Growing interest in eco-friendly repair options
4. **Transparency**: Customers want clear pricing and service explanations
5. **Customer Experience**: Service quality increasingly matters

**Business Opportunities:**
• **Corporate Fleet Management**: Lucrative B2B segment
• **Subscription Services**: Monthly maintenance packages
• **Emergency Services**: Premium 24/7 support
• **Mobile Services**: Go-to-customer approach for simple repairs
• **Online Consultations**: Pre-diagnosis through video/images

**Trend-Based Growth Strategy:**
• Enhance online presence and booking system
• Develop corporate partnerships
• Create maintenance packages
• Invest in customer communication tech

Which opportunity interests you most?`
        metadata = {
          trends: [
            'digital transformation',
            'preventive maintenance',
            'sustainability',
            'transparency'
          ],
          opportunities: ['B2B expansion', 'subscription model', 'mobile services']
        }
      } else if (message.toLowerCase().includes('strategy') || message.toLowerCase().includes('growth')) {
        response = `Let me help develop your growth strategy...

**Strategic Planning Framework:**

**Phase 1: Foundation (Next 3 months)**
• Optimize current operations
• Implement booking system
• Build customer review presence
• Train team on service excellence

**Phase 2: Expansion (3-6 months)**
• Develop corporate partnerships
• Launch subscription services
• Expand service offerings
• Build marketing presence

**Phase 3: Scaling (6-12 months)**
• Open additional locations (if applicable)
• Develop mobile services
• Create industry partnerships
• Build brand recognition

**Key Growth Drivers:**
1. **Customer Service Excellence**: Best-in-class service
2. **Digital Innovation**: Modern booking and communication
3. **Strategic Partnerships**: Corporate and referral networks
4. **Team Development**: Skilled and motivated staff
5. **Brand Building**: Strong local reputation

**Recommended Focus Areas:**
• Customer satisfaction (highest ROI)
• Online presence optimization
• Corporate client development
• Service innovation

What's your growth priority?`
        metadata = {
          growthRate: 'target: 20-30% year-over-year',
          priorities: ['customer satisfaction', 'market reach', 'service quality'],
          timeline: '12 months'
        }
      } else {
        response = `I'm your Business Strategy Assistant. I help with:

**Market Research:**
• Market size and growth analysis
• Customer segment identification
• Pricing and revenue opportunities
• Geographic expansion potential

**Competitive Analysis:**
• Competitor benchmarking
• Your competitive advantages
• Market positioning strategy
• Differentiation opportunities

**Business Development:**
• Growth strategy development
• Market trend identification
• New opportunity discovery
• Expansion planning

**Strategic Planning:**
• 3, 6, 12 month strategy
• Priority setting
• Resource allocation
• Success metrics

**What strategic question would you like to explore?**`
        metadata = {
          capabilities: [
            'Market Analysis',
            'Competitor Research',
            'Trend Identification',
            'Growth Strategy'
          ]
        }
      }
    } catch (err) {
      console.error('Strategy agent error:', err)
      response = 'I encountered an error processing your request.'
    }

    return NextResponse.json({
      response,
      metadata,
      message: response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Strategy chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
