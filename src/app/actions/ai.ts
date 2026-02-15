'use server'

export async function generateContent(prompt: string) {
    // Simulate network delay for "Thinking" state
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock Response
    return {
        success: true,
        content: `## AI Generated Draft: ${prompt}\n\nThis is a simulated response from the AI Writer. In the production environment, this would call the OpenAI or Anthropic API to generate high-quality content based on your prompt.\n\n### Key Points:\n- Point 1 related to ${prompt}\n- Point 2 related to ${prompt}\n- SEO optimized tags auto-generated.\n\n[End of Draft]`
    }
}
