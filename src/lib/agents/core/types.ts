export type Role = 'system' | 'user' | 'assistant' | 'tool'

export interface Message {
    role: Role
    content: string
    toolCalls?: ToolCall[]
    toolResults?: ToolResult[]
    timestamp?: number
}

export interface ToolCall {
    id: string
    name: string
    args: Record<string, any>
}

export interface ToolResult {
    toolCallId: string
    output: string | Record<string, any>
}

export interface ConversationContext {
    userId: string
    sessionId: string
    messages: Message[]
    metadata?: Record<string, any>
}

export interface AgentConfig {
    model: string // e.g., 'gemini-3-flash-preview'
    systemPrompt: string
    temperature?: number
    tools?: ToolDefinition[]
}

export interface ToolDefinition {
    name: string
    description: string
    parameters: Record<string, any> // JSON Schema
    execute: (args: any) => Promise<any>
}
