'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Trash2, Clock, Zap, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Conversation {
  id: string
  title?: string
  messageCount: number
  lastActive: number
  duration: number
  tokenCount?: number
}

interface ConversationManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelectConversation?: (convId: string) => void
}

export function ConversationManager({
  isOpen,
  onClose,
  onSelectConversation,
}: ConversationManagerProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadConversations()
    }
  }, [isOpen])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/chat')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Failed to load conversations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (convId: string) => {
    if (!confirm('Delete this conversation?')) return

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId }),
      })

      if (!response.ok) throw new Error('Failed to delete')

      setConversations((prev) => prev.filter((c) => c.id !== convId))
      toast.success('Conversation deleted')
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete conversation')
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed left-4 bottom-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ maxHeight: '32rem' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1a] px-6 py-4">
            <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#E62329]" />
              Conversations
            </h3>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <p>Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      onSelectConversation?.(conv.id)
                      onClose()
                    }}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-[#121212] text-sm truncate">
                        {conv.title || `Conversation ${conv.id.slice(-6)}`}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(conv.id)
                        }}
                        className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {conv.messageCount} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(conv.lastActive)}
                      </span>
                      {conv.tokenCount && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {conv.tokenCount}
                        </span>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[#E62329]" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <button
              onClick={loadConversations}
              className="w-full py-2 px-4 rounded-full text-xs font-black uppercase tracking-widest bg-[#121212] text-white hover:bg-[#E62329] transition-colors"
            >
              Refresh
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
