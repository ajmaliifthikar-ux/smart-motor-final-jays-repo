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

    if (message.toLowerCase().includes('post') || message.toLowerCase().includes('content')) {
      response = `Social Media Posting Strategy:

📱 **Platform-Specific Tips:**

**Instagram** (Visual-first):
• Best times: 8-10 AM, 12-1 PM, 5-7 PM
• Content: Behind-the-scenes, before/after, testimonials
• Hashtags: 15-30 relevant tags
• Captions: 125-150 chars ideal
• Engagement: Reply to comments within 1 hour

**Facebook** (Community-focused):
• Best times: Same as Instagram
• Content: Educational, promotional, testimonials
• Length: 150-200 characters
• Videos: 90+ seconds perform best
• Engagement: Community discussions

**LinkedIn** (B2B):
• Best times: Tuesday-Thursday, 8-10 AM
• Content: Industry insights, corporate partnerships
• Length: 250-300 characters
• Articles: Long-form thought leadership
• Engagement: Professional tone

**TikTok** (Trending):
• Best times: 6-10 AM, 7-11 PM
• Content: Quick tips, entertainment, trends
• Length: 15-60 seconds
• Audio: Use trending sounds
• Engagement: Respond to comments via video

**Content Calendar Template:**
Monday: Educational/How-to
Tuesday: Customer testimonial
Wednesday: Behind-the-scenes
Thursday: Promotional offer
Friday: Employee highlight
Saturday: Tips & tricks
Sunday: Weekend special

What platform are you focusing on?`
      metadata = {
        platforms: 4,
        strategy: 'multi-channel',
        postsPerWeek: 7
      }
    } else if (message.toLowerCase().includes('engagement') || message.toLowerCase().includes('grow')) {
      response = `Engagement & Growth Strategy:

📊 **Growth Tactics (Proven):**

1. **Engagement Rate Optimization** (+30% growth)
   • Post at optimal times for your audience
   • Ask questions in captions
   • Respond to EVERY comment within 1 hour
   • Use polls, quizzes, CTAs

2. **Hashtag Strategy** (+20% reach)
   • Mix popular (#AutoService - 100K+)
   • With niche (#UAEAutoRepair - 10K)
   • Create branded hashtag
   • Research competitor hashtags

3. **Collaboration Growth** (+15% followers)
   • Partner with local businesses
   • Cross-promote with complementary services
   • Customer shoutouts & testimonials
   • Employee takeovers

4. **Consistency Wins** (+25% retention)
   • Post at consistent times
   • Regular posting schedule (daily or 3-4x/week)
   • Same posting day = better performance
   • Content batching saves time

5. **Video Dominance** (+40% engagement)
   • Video gets 10x more engagement than photos
   • Testimonial videos (customer favorites)
   • Behind-the-scenes content
   • Quick tips videos (30 seconds)

**Monthly Goals:**
• 50-100 new followers
• 5-10% engagement rate
• 20-30 customer interactions
• 3-5 testimonial videos

**90-Day Plan:**
→ Week 1-2: Post consistency
→ Week 3-4: Engagement focus
→ Month 2: Video content launch
→ Month 3: Collaboration campaigns

What's your growth target?`
      metadata = {
        tactics: 5,
        growthPotential: '+30% monthly',
        timeline: '90-days'
      }
    } else if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('calendar')) {
      response = `Social Media Calendar & Scheduling:

📅 **Optimal Posting Times (UAE):**

**Monday-Friday:**
• 8-10 AM (Morning commute)
• 12-1 PM (Lunch break)
• 5-7 PM (Evening wind-down)

**Saturday-Sunday:**
• 10 AM (Weekend start)
• 2 PM (Afternoon)
• 7 PM (Evening leisure)

**Content Mix (Weekly):**
📸 50% Educational/Tips
💬 25% Engagement (questions, polls)
🎯 15% Promotional
❤️ 10% Behind-scenes/Culture

**Batching Strategy (Save 5 hours/week):**
Day 1: Film/capture 4 weeks content
Day 2: Design graphics/edit videos
Day 3: Write captions & schedule
Day 4: Monitor & engage

**Scheduling Tools:**
• Hootsuite - Multi-platform ($39+)
• Buffer - Simple & clean ($15+)
• Meta Business Suite - Free (Facebook/Instagram)
• Later - Visual planning ($25+)

**Sample Week:**
Mon: Tip + engagement
Tue: Customer testimonial
Wed: Behind-scenes
Thu: Offer/promotion
Fri: Quick video
Sat: Educational
Sun: Community highlight

Ready to schedule your content?`
      metadata = {
        strategy: 'batch-content',
        timeSaved: '5 hours/week',
        optimalTimes: 6
      }
    } else {
      response = `Social Media Management:

I help with:
📱 **Posting Strategy** - Best times, content types
📊 **Growth** - Engagement tactics, follower growth
📅 **Scheduling** - Content calendar, batching
🎯 **Campaigns** - Promotional strategies
💬 **Engagement** - Comment responses, community

What aspect needs help?`
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
    console.error('Social API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
