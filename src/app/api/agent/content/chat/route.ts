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

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let response = ''
    let metadata: Record<string, any> = {}

    try {
      if (message.toLowerCase().includes('blog') || message.toLowerCase().includes('post')) {
        response = `I can help you brainstorm amazing blog content!

**Blog Post Ideas for Auto Service Industry:**
1. "10 Signs Your Car Needs Service Soon"
2. "Complete Guide to Car Maintenance Schedule"
3. "Why Regular Oil Changes Save Money"
4. "Understanding Different Types of Brake Pads"
5. "DIY Car Maintenance vs Professional Service"
6. "How to Prepare Your Car for Summer"
7. "Emergency Car Repairs: What to Do"
8. "Fuel Efficiency Tips for Your Vehicle"

**Post Structure Tips:**
• Start with a compelling hook (3-5 lines)
• Use clear headings (H2, H3)
• Include practical tips (5-7 items)
• Add a strong call-to-action at the end
• Optimize for keywords related to your service area

**What type of blog content would resonate with your audience?**`
        metadata = {
          contentType: 'blog',
          ideas: 8,
          difficulty: 'medium'
        }
      } else if (message.toLowerCase().includes('social') || message.toLowerCase().includes('post')) {
        response = `Let me help you generate social media content ideas!

**Engaging Social Post Ideas:**

📸 **Before & After Posts**
"Transformed this [Service Type] from [Bad] to [Good] condition! Your vehicle deserves expert care. 🚗✨"

🎯 **Educational Posts**
"Did you know? Tire rotation every 5,000 miles extends tire life by 3+ years. Book your service today!"

⏰ **Appointment Reminders**
"It's been [X months] since your last service. Time for a checkup? 📅 Book now with just a tap!"

💰 **Promotional Posts**
"Limited time: Get [discount]% off on [service] this month only! Don't miss out 🎉"

🏆 **Customer Testimonials**
"Amazing service! Fixed my car in record time. Highly recommend! - [Customer Name] ⭐⭐⭐⭐⭐"

**Best Posting Times:**
• Weekdays: 8-10 AM, 12-1 PM, 5-7 PM
• Weekends: 10 AM, 2 PM, 7 PM

What's your social media goal?`
        metadata = {
          contentType: 'social',
          platforms: ['Instagram', 'Facebook', 'LinkedIn'],
          postIdeas: 5
        }
      } else if (message.toLowerCase().includes('video') || message.toLowerCase().includes('script')) {
        response = `Here are compelling video script ideas for your auto service business!

**Video Script Template (30-60 seconds):**

[HOOK - First 3 seconds]
"Is your car making weird sounds? Your wallet might be crying too!"

[PROBLEM]
"Ignoring small issues leads to expensive repairs. Most car owners wait too long."

[SOLUTION]
"Regular maintenance catches problems early. We specialize in [Your Service]."

[PROOF]
"Our customers save an average of $800 per year with preventive care."

[CTA]
"Book your service today. Link in bio. Your car will thank you! 🚗"

**Video Ideas That Work:**
1. Common car problems & how to spot them
2. Maintenance tips for different seasons
3. Customer testimonials (video)
4. Behind-the-scenes shop tour
5. Quick maintenance hacks
6. Service walkthroughs
7. Emergency car care tips

**Platform-Specific Tips:**
• TikTok: Fast-paced, trending audio
• YouTube: Longer, detailed tutorials
• Instagram Reels: Quick tips, eye-catching visuals
• Facebook: Testimonials, educational content

Ready to script your video?`
        metadata = {
          contentType: 'video',
          formats: ['30-second', '60-second', 'tutorial'],
          platforms: ['TikTok', 'YouTube', 'Instagram', 'Facebook']
        }
      } else if (message.toLowerCase().includes('ad') || message.toLowerCase().includes('copy')) {
        response = `Let me generate high-converting ad copy for you!

**Attention-Grabbing Ad Headlines:**
• "Expert Car Service at [Your Price] - Book Now"
• "Your Car Deserves Better Service"
• "Stop Paying for Expensive Repairs"
• "Same-Day Service Available"
• "Trusted by [Number] Happy Customers"

**Facebook/Instagram Ad Copy Template:**

HOOK: "Is your car maintenance costing you a fortune?"

VALUE: "Save up to 30% with our preventive maintenance packages."

PROOF: "Rated 4.8/5 stars by [Number] satisfied customers"

CTA: "Claim Your Free Diagnostic Today →"

**Google Ads Copy:**
Headline 1: "Professional Car Service"
Headline 2: "Transparent Pricing"
Headline 3: "Book Your Appointment"

Description: "Expert auto repair for all makes/models. Quick turnaround, fair prices."

**Ad Copy Best Practices:**
✓ Use strong action verbs
✓ Create urgency (Limited time, slots filling)
✓ Highlight benefits, not features
✓ Include social proof (ratings, testimonials)
✓ Clear call-to-action
✓ Local keywords

What's your ad objective?`
        metadata = {
          contentType: 'advertising',
          formats: ['social', 'google', 'email'],
          variations: 3
        }
      } else if (message.toLowerCase().includes('caption') || message.toLowerCase().includes('hashtag')) {
        response = `I'll create captions and hashtags that boost engagement!

**Caption Formulas That Work:**

**The Question:** "When was your last car service? Most people wait too long! 🚗"

**The Story:** "This customer came in with a mysterious noise. Turned out to be [X]. All fixed now!"

**The Educational:** "Pro tip: Your tire pressure drops 1 PSI for every 10°F temperature drop. Check yours!"

**The CTA:** "Tag someone who needs to book a service! 👇"

**The Promotional:** "🎉 FLASH SALE: $50 off oil change this weekend only! DM us to book."

**Top Hashtags for Auto Service (UAE):**
#SmartMotor #AbuDhabiAutoRepair #CarService #CarMaintenance #AutoRepair
#MechanicLife #CarCare #DubaiAutoRepair #VehicleService #CarTips
#AutoServiceUAE #CarRepairAD #MaintenanceMatters

**Hashtag Strategy:**
• 15-25 hashtags per post (optimal range)
• Mix popular (1M+) and niche (10K-100K)
• Create branded hashtag (#YourShopName)
• Follow trending automotive hashtags

**Caption Length Tips:**
• Instagram: 125-150 characters (sweet spot)
• Facebook: 150-200 characters
• TikTok: Keep first line punchy

Which platform are you posting to?`
        metadata = {
          contentType: 'social-copy',
          hashtags: 12,
          formulas: 5
        }
      } else {
        response = `Welcome to the Content Brainstormer! I can help with:

**Content Types I Generate:**
📝 **Blog Post Ideas** - SEO-optimized topics and outlines
📱 **Social Media Posts** - Platform-specific content strategies
🎬 **Video Scripts** - 30-60 second hooks and full scripts
📢 **Ad Copy** - Headlines, descriptions, CTAs
#️⃣ **Captions & Hashtags** - Engagement-boosting copy

**How It Works:**
1. Tell me what you want to create
2. I'll suggest multiple options
3. Pick your favorite and refine it
4. Copy directly to your platform

**What content would you like to create today?**`
        metadata = {
          services: ['blog', 'social', 'video', 'ads', 'captions'],
          ready: true
        }
      }
    } catch (err) {
      console.error('Content agent error:', err)
      response = 'I encountered an error. Please try again.'
    }

    return NextResponse.json({
      response,
      metadata,
      message: response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Content chat API error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
