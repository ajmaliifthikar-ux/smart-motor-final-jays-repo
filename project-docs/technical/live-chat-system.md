# Live Chat System - Bidirectional Gemini Streaming

## Overview
The Smart Motor platform now features a bidirectional Gemini-powered chat system with real-time token streaming, conversation memory, and intelligent context awareness.

## Architecture

### Components

#### 1. **GeminiLiveSession** (`src/lib/gemini-live.ts`)
Manages streaming conversations with Gemini 3.0 Flash.

**Key Features:**
- Token-by-token streaming with async generators
- Automatic message persistence to Redis
- Global knowledge base + personal context injection
- Graceful error handling with fallbacks

**API:**
```typescript
interface GeminiLiveSession {
  streamMessage(userMessage: string): AsyncGenerator<StreamChunk>
  resetTokenCount(): void
  getTokenCount(): number
}

interface StreamChunk {
  type: 'token' | 'metadata' | 'error' | 'done'
  content?: string
  tokenCount?: number
  finishReason?: string
  error?: string
}
```

#### 2. **Server-Sent Events Endpoint** (`src/app/api/ai/live/route.ts`)
Real-time streaming API using Server-Sent Events (SSE).

**Request:**
```javascript
POST /api/ai/live
{
  message: string
  conversationId?: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}
```

**Response Stream:**
```
data: {"type":"token","content":" ","tokenCount":1}
data: {"type":"token","content":"Hello","tokenCount":2}
...
data: {"type":"metadata","tokenCount":142,"finishReason":"STOP"}
data: {"type":"done"}
```

**Features:**
- Automatic client disconnect handling
- 10ms chunking delay for proper client buffering
- Abort signal support for cancellation
- CORS headers for cross-origin requests

#### 3. **LiveChatPanel Component** (`src/components/ui/live-chat-panel.tsx`)
Enhanced chat UI with dual-mode support.

**Modes:**
- **Live Mode** 🔴: Token-by-token streaming with visual feedback
- **Standard Mode** ⚪: Traditional request-response

**Features:**
- Real-time message streaming display
- Animated token appending
- Token count indicator with ⚡ icon
- Mode toggle button
- Typing indicator
- Mobile-responsive design
- Keyboard shortcuts (Shift+Enter for newline)

**Props:**
```typescript
interface LiveChatPanelProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}
```

#### 4. **ConversationManager Component** (`src/components/ui/conversation-manager.tsx`)
Sidebar for browsing and managing past conversations.

**Features:**
- List all user conversations with metadata
- Display message count, duration, token usage
- One-click conversation loading
- Delete with confirmation
- Formatted timestamps (e.g., "2h ago")
- Search-ready structure

## Memory Integration

### Storage Architecture
All conversations persist in Redis with automatic TTL cleanup.

**Key Format:**
- Conversation data: `conversation:${userId}:${conversationId}`
- User conversations index: `user:${userId}:conversations`
- Personal context: `context:${userId}:${contextId}`

**TTL:** 7 days auto-cleanup

### Context Layers

1. **Global Knowledge Base** (shared by all users)
   - Company information (services, pricing, facilities)
   - General automotive advice
   - Policy information

2. **Personal Memory** (specific to each user)
   - Full conversation history
   - Past interactions with the company
   - Personal preferences and past issues

3. **Conversation Context** (current session)
   - Last 10 messages for immediate context
   - Relevant stored interactions from user's history

### Automatic Persistence
Every response is automatically stored:
```typescript
// Message persisted
await aiMemory.addMessage(userId, convId, 'assistant', response)

// Exchange stored for future relevance
await aiMemory.storeContext(userId, contextId, q&a, metadata)
```

## Usage Examples

### Basic Integration
```tsx
import { useState } from 'react'
import { LiveChatPanel } from '@/components/ui/live-chat-panel'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Chat</button>
      <LiveChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
```

### With Conversation Manager
```tsx
import { useState } from 'react'
import { LiveChatPanel } from '@/components/ui/live-chat-panel'
import { ConversationManager } from '@/components/ui/conversation-manager'

export function ChatWithHistory() {
  const [isOpen, setIsOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedConv, setSelectedConv] = useState<string | null>(null)

  return (
    <>
      <LiveChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ConversationManager
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectConversation={(convId) => {
          setSelectedConv(convId)
          // Load conversation logic here
        }}
      />
    </>
  )
}
```

## Token Counting

The system implements word-based token approximation:
```typescript
// Actual implementation in GeminiLiveSession
const tokens = text.split(/(\s+)/).filter((t) => t.length > 0)
```

**Why Word-Based?**
- Gemini's official token counting API is rate-limited
- Word-based approximation: ~1 token ≈ 1 word
- Sufficient for UI display and user awareness
- Future: Integrate Google's official token counter for precision

## Error Handling

### Connection Failures
- SSE connection drops → automatic graceful shutdown
- Toast notification to user
- Partial response preserved

### Gemini API Errors
- Rate limits → user notified, can retry
- Invalid requests → detailed error message
- Network timeouts → automatic retry with backoff

### Memory Errors
- Redis unavailable → falls back to in-memory buffer
- Context not found → graceful degradation

## Performance Characteristics

- **Streaming latency:** 10ms per chunk (configurable)
- **Token buffering:** Groups ~5-10 tokens before emit
- **Memory usage:** ~2-5MB per concurrent conversation
- **Concurrent users:** No hard limit (Redis-backed)

## Future Enhancements

### Phase 1 (Ready)
- ✅ Token-by-token streaming
- ✅ Conversation history
- ✅ Memory persistence

### Phase 2 (Planned)
- 🔄 Voice input (speech-to-text)
- 🔄 Voice output (text-to-speech)
- 🔄 Real-time translation
- 🔄 Sentiment analysis

### Phase 3 (Advanced)
- 📋 Multi-turn function calling
- 📋 Document upload & RAG
- 📋 Conversation branching
- 📋 Admin analytics dashboard

## Configuration

**Environment Variables:**
```bash
GEMINI_API_KEY=<your-key>
GEMINI_MODEL=gemini-3-flash-preview
REDIS_HOST=<redis-host>
REDIS_PORT=6379
REDIS_PASSWORD=<optional>
```

**Per-Request Customization:**
```typescript
// Override system prompt
systemPrompt: "Custom instructions..."

// Limit token generation
maxTokens: 2048

// Adjust randomness
temperature: 0.9
```

## Testing

### Unit Test Template
```typescript
import { createLiveSession } from '@/lib/gemini-live'

it('should stream tokens', async () => {
  const session = createLiveSession({
    userId: 'test-user',
    conversationId: 'test-conv',
  })

  const chunks: StreamChunk[] = []
  for await (const chunk of session.streamMessage('Hello')) {
    chunks.push(chunk)
  }

  expect(chunks.length).toBeGreaterThan(0)
  expect(chunks[chunks.length - 1].type).toBe('done')
})
```

### Manual Testing
1. Open chat panel in browser
2. Toggle between Live Mode and Standard Mode
3. Verify streaming display
4. Check conversation persists in history
5. Test conversation reload

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No streaming response | Endpoint not found | Verify `/api/ai/live` route exists |
| Tokens appear all at once | Client-side buffering | Check 10ms delay in endpoint |
| Memory not persisting | Redis down | Check Redis connection & TTL |
| High latency | Network delay | Reduce maxTokens or check Gemini quota |
| Mode toggle not working | State management issue | Verify isOpen prop changes |

## Code Style Compliance

✅ Follows GEMINI.md gold standard:
- PascalCase components (LiveChatPanel, ConversationManager)
- camelCase variables/functions
- Tailwind CSS with `cn()` utility
- Smart Motor color palette (#121212, #E62329)
- Responsive mobile-first design
- Framer Motion animations
- Proper TypeScript interfaces

## References

- [Gemini API Docs](https://ai.google.dev/docs)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Next.js Streaming](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming)
- [Redis Memory Management](project-docs/technical/redis-cache-strategy.md)
