import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { url } = await req.json()

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // 1. Fetch the page content (Simplified crawl)
        // In a real production environment, we might use Puppeteer here
        const response = await fetch(url)
        const html = await response.text()

        // 2. Prepare the prompt for Gemini
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview' })

        const prompt = `
            Analyze the following HTML content for SEO purposes. 
            Focus on:
            1. Technical SEO (Title tags, Meta descriptions, SSL, Header hierarchy).
            2. Content Quality (Keyword density, Readability).
            3. Recommendations (Specific, actionable steps for a UAE-based automotive service).
            
            Target Keywords: "Mercedes service Abu Dhabi", "BMW repair Musaffah", "Audi maintenance UAE".
            
            Return ONLY a valid JSON object with the following structure:
            {
                "score": 85,
                "technical": { "status": "Good", "issues": ["No H1 tag", "Missing alt text"] },
                "content": { "score": 90, "analysis": "High quality content with good keyword placement" },
                "recommendations": ["Add H1 tag to the hero section", "Update meta description to include phone number"]
            }
            
            HTML Content:
            ${html.substring(0, 5000)} // Limiting to 5000 chars for token limits
        `

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        // Extract JSON from the response (cleaning up triple backticks if present)
        const jsonStr = text.replace(/```json|```/g, '').trim()
        const analysis = JSON.parse(jsonStr)

        // 3. Save to database
        const report = await (prisma as any).sEOReport.create({
            data: {
                url,
                score: analysis.score,
                technicalLogs: analysis.technical,
                onPageLogs: { headers: analysis.technical.issues }, // Mapping simplified for now
                contentLogs: analysis.content,
                recommendations: analysis.recommendations
            }
        })

        return NextResponse.json(report)
    } catch (error) {
        console.error('SEO Analysis failed:', error)
        return NextResponse.json({ error: 'Failed to perform SEO analysis' }, { status: 500 })
    }
}
