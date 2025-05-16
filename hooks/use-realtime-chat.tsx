import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export interface ChatMessage {
  id: string
  content: string
  created_at: string
  room: string
  username: string
  user_id: string
  user: { name: string }
}

export const useRealtimeChat = ({
  roomName,
  username,
}: {
  roomName: string
  username: string
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room', roomName)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data.map((m) => ({
          ...m,
          user: { name: m.username },
          created_at: m.created_at || '',
        })))
      }
    }

    fetchMessages()

    const channel = supabase
      .channel(`room:${roomName}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room=eq.${roomName}` },
        (payload) => {
          const newMsg = payload.new
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              content: newMsg.content,
              created_at: newMsg.created_at || '',
              room: newMsg.room,
              username: newMsg.username,
              user_id: newMsg.user_id,
              user: { name: newMsg.username },
            } as ChatMessage,
          ])
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsConnected(true)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomName])

  const sendMessage = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('Aucun utilisateur connecté.')
      return
    }

    const { error } = await supabase.from('messages').insert({
      content,
      room: roomName,
      user_id: user.id,
      username, 
    })

    if (error) console.error('Erreur Supabase :', error.message)
  }

  return {
    messages,
    sendMessage,
    isConnected,
  }
}