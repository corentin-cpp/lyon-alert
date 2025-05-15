import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export interface ChatMessage {
  id: string
  content: string
  createdAt: string
  room: string
  username: string
  user_id: string
  user: { name: string }
}

interface Props {
  roomName: string
  username: string
  zone?: string
}

export const useRealtimeChat = ({ roomName, username }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let channel = supabase
      .channel(`room:${roomName}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room=eq.${roomName}` },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages((prev) => [...prev, { ...newMessage, user: { name: newMessage.username } }])
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })
      
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room', roomName)
        .order('created_at', { ascending: true })

      setMessages(data?.map(msg => ({ ...msg, user: { name: msg.username } })) || [])
    }

    fetchMessages()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomName])

  const sendMessage = async (content: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from('messages').insert({
      content,
      room: roomName,
      user_id: user.id,
      username,
    })
  }

  return {
    messages,
    sendMessage,
    isConnected,
  }
}