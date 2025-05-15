'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface RealtimeChatProps {
  roomName: string
  username: string
  zone?: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

const zoneInfo: Record<string, { name: string; risk: string; color: string }> = {
  '1': { name: 'Lyon 1er', risk: 'Séisme + Inondation', color: 'bg-orange-500' },
  '2': { name: 'Lyon 2ème', risk: 'Séisme + Inondation', color: 'bg-orange-500' },
  '3': { name: 'Lyon 3ème', risk: 'Inondation', color: 'bg-blue-500' },
  '4': { name: 'Lyon 4ème', risk: 'Séisme + Inondation', color: 'bg-orange-500' },
  '5': { name: 'Lyon 5ème', risk: 'Séisme', color: 'bg-red-500' },
  '6': { name: 'Lyon 6ème', risk: 'Inondation', color: 'bg-blue-500' },
  '7': { name: 'Lyon 7ème', risk: 'Inondation', color: 'bg-blue-500' },
  '8': { name: 'Lyon 8ème', risk: 'Inondation', color: 'bg-blue-500' },
  '9': { name: 'Lyon 9ème', risk: 'Séisme', color: 'bg-red-500' },
}

export const RealtimeChat = ({
  roomName,
  username,
  zone,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    zone,
    username,
  })

  const [newMessage, setNewMessage] = useState('')

  const zoneLabel = zoneInfo[zone || ''] || {
    name: `Zone ${zone ?? '?'}`,
    risk: 'Inconnu',
    color: 'bg-gray-500',
  }

  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    return uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) onMessage(allMessages)
  }, [allMessages, onMessage])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return

      sendMessage(newMessage)
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage]
  )

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground antialiased">
      {/* Zone Info Header */}
      <div className={cn('px-6 py-4 text-white shadow-md', zoneLabel.color)}>
        <h2 className="text-xl font-bold">{zoneLabel.name}</h2>
        <p className="text-sm opacity-90">Risque : {zoneLabel.risk}</p>
      </div>

      {/* Chat Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-muted"
      >
        {allMessages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Aucun message pour l'instant. Commencez la conversation !
          </div>
        )}

        <div className="space-y-2">
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader = !prevMessage || prevMessage.user.name !== message.user.name

            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user.name === username}
                  showHeader={showHeader}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 border-t border-border p-4 bg-background"
      >
        <Input
          className={cn(
            'rounded-full bg-background text-sm transition-all duration-300 flex-1',
            !isConnected && 'opacity-50'
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écris ton message..."
          disabled={!isConnected}
        />
        <Button
          className="aspect-square rounded-full"
          type="submit"
          disabled={!isConnected || !newMessage.trim()}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
