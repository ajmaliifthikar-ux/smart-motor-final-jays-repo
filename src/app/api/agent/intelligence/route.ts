import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    let response = ''
    let metadata: Record<string, any> = {}

    if (message.toLowerCase().includes('trend')) {
      response = `Market Trends Analysis (UAE 2026):

📈 **Current Trends:**
1. **Preventive Maintenance** - Increasing 15% YoY
2. **Digital-First Customers** - 65% prefer online booking
3. **Transparency Focus** - Upfront pricing expected
4. **Eco-Friendly Services** - Growing demand
5. **Corporate Partnerships** - B2B growth

**Actionable Insights:**
✓ Create maintenance packages
✓ Improve online booking UX
✓ Display pricing prominently
✓ Offer eco-friendly options
✓ Develop corporate programs

**Impact:** +20% revenue potential`
      metadata = {
        trends: 5,
        impactPotential: '+20%'
      }
    } else if (message.toLowerCase().includes('opportunity')) {
      response = `Revenue Opportunities:

🎯 **Top 5 Opportunities:**

1. **Corporate Fleet** - $5K+/month
2. **Subscriptions** - $2K+/month  
3. **Diagnostics** - $1.5K+/month
4. **Mobile Services** - $1K+/month
5. **Premium Services** - $1.5K+/month

**Quick Implementation:** 30 days
**Revenue Impact:** +$11K/month
**Effort Level:** Medium

Which should we prioritize?`
      metadata = {
        opportunities: 5,
        revenueImpact: '+11000'
      }
    } else if (message.toLowerCase().includes('persona')) {
      response = `Customer Personas:

👨‍💼 **Busy Professional** (Most Profitable)
💼 **Fleet Manager** (Recurring Revenue)
👪 **Family Owner** (High Volume)
🏎️ **Enthusiast** (Premium Services)

**Marketing Strategy:** Focus on professionals first, then fleet managers.

**Recommended Channels:**
• Professionals: WhatsApp, LinkedIn
• Fleet: Direct B2B outreach
• Family: Facebook, Google Local`
      metadata = {
        personas: 4,
        focus: 'professionals-first'
      }
    } else {
      response = `Business Intelligence Available:

📊 **Trends** - Market analysis & industry shifts
💡 **Opportunities** - Revenue growth potential
👥 **Personas** - Customer segments & messaging
💰 **Pricing** - Competitive positioning
📈 **Growth** - Expansion strategies

What insights do you need?`
      metadata = {
        services: 5
      }
    }

    return NextResponse.json({
      response,
      metadata,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Intelligence API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
