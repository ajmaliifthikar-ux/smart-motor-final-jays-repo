import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface SEOAgentConfig {
    tone: 'professional' | 'engaging' | 'technical'
    targetAudience: 'car_owners' | 'enthusiasts' | 'mechanics'
}

export class SEOSpecialistAgent {
    private model: any
    private config: SEOAgentConfig

    constructor(config: SEOAgentConfig = { tone: 'professional', targetAudience: 'car_owners' }, model?: any) {
        // Use a model capable of JSON response for meta tags if possible, or fallback to text
        this.model = model || genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
            systemInstruction: `You are an expert SEO Specialist for Smart Motor (Abu Dhabi). 
            Your goal is to optimize content for high ranking on Google.ae particularly for luxury car keywords.`
        })
        this.config = config
    }

    /**
     * analyzeKeywords - Suggests high-value keywords for a topic
     */
    async analyzeKeywords(topic: string): Promise<string[]> {
        const prompt = `
            Analyze the topic: "${topic}" for a luxury car service center in UAE.
            Suggest 5-10 high-traffic, low-competition keywords or long-tail phrases.
            Focus on intent: "Repair", "Service", "Cost", "Near me".
            Output ONLY a JSON array of strings. Example: ["Audi repair Abu Dhabi", "BMW oil change cost"]
        `
        try {
            const result = await this.model.generateContent(prompt)
            const text = result.response.text().replace(/```json|```/g, '').trim()
            return JSON.parse(text)
        } catch (error) {
            console.error("SEO keyword analysis failed:", error)
            return [topic] // Fallback
        }
    }

    /**
     * Generates a blog post based on a topic and keywords
     */
    async generateBlogPost(topic: string, keywords: string[]): Promise<string> {
        const prompt = `
      You are an expert SEO Content Writer for Smart Motor, a luxury car service center in UAE.
      
      Topic: ${topic}
      Keywords to target: ${keywords.join(', ')}
      Target Audience: ${this.config.targetAudience}
      Tone: ${this.config.tone}
      
      Instructions:
      1. Write a deep, comprehensive, and authoritative blog post (approx. 1200-1500 words).
      2. Utilize your extensive knowledge base to provide technical depth where appropriate.
      3. Use H2/H3 for subheadings.
      4. Naturally integrate the keywords in the first 100 words and throughout headings.
      5. Focus on local relevance (Abu Dhabi, Mussafah, UAE context).
      6. Include a call to action (CTA) to book a service at Smart Motor.
      
      Output Format: Markdown
    `

        try {
            const result = await this.model.generateContent(prompt)
            return result.response.text()
        } catch (error) {
            console.error('SEO Agent Error:', error)
            throw new Error('Failed to generate blog post')
        }
    }

    /**
     * Generates meta tags for a given page description
     */
    async generateMetaTags(pageContent: string): Promise<{ title: string; description: string }> {
        const prompt = `
      Generate SEO-optimized meta title (max 60 chars) and meta description (max 160 chars) for the following content:
      
      ${pageContent.substring(0, 1000)}...
      
      Output format JSON: { "title": "...", "description": "..." }
    `

        try {
            const result = await this.model.generateContent(prompt)
            const text = result.response.text()
            // Basic cleanup to ensure JSON parsing if the model adds markdown blocks
            const jsonStr = text.replace(/```json|```/g, '').trim()
            return JSON.parse(jsonStr)
        } catch (error) {
            console.error('SEO Agent Meta Tag Error:', error)
            return { title: '', description: '' }
        }
    }
}
