import { GoogleGenerativeAI } from '@google/generative-ai'
import { AgentConfig } from '../core/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export class SEOSpecialist {
    private model: any
    private config: AgentConfig

    constructor() {
        this.config = {
            model: 'gemini-3-pro-preview',
            systemPrompt: `You are an expert SEO Strategist for Smart Motor.
      
      Your responsibilities:
      - Analyze content for keyword optimization (Focus: "Luxury Car Repair Abu Dhabi").
      - Generate meta tags (Title < 60 chars, Desc < 160 chars).
      - Draft high-quality, authoritative blog posts.
      
      Tone: Professional, Technical, Authoritative.
      `,
            temperature: 0.7
        }

        this.model = genAI.getGenerativeModel({
            model: this.config.model,
            systemInstruction: this.config.systemPrompt
        })
    }

    async generateMetaTags(content: string): Promise<{ title: string, description: string }> {
        const prompt = `Generate SEO-optimized meta tags for:\n\n${content.substring(0, 1000)}...\n\nOutput JSON: { "title": "...", "description": "..." }`

        try {
            const result = await this.model.generateContent(prompt)
            const text = result.response.text().replace(/```json|```/g, '').trim()
            return JSON.parse(text)
        } catch (e) {
            console.error('SEO Meta Gen Error:', e)
            return { title: '', description: '' }
        }
    }

    async generateBlogPost(topic: string, keywords: string[]): Promise<string> {
        const prompt = `Write a comprehensive blog post about "${topic}".\nKeywords: ${keywords.join(', ')}\n\nFormat: Markdown.`
        const result = await this.model.generateContent(prompt)
        return result.response.text()
    }
}
